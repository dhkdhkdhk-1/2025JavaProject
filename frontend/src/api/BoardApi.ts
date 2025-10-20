import { api, refreshAccessToken } from "./AuthApi";
import { AxiosRequestHeaders, AxiosError } from "axios";

export interface BoardRequest {
  title: string;
  content: string;
  type: string;
}

export interface BoardResponse {
  id: number;
  title: string;
  content: string;
  type: string;
  username: string;
  viewCount: number;
  createdAt: string;
  modifiedAt: string;
}

// ✅ maxId 포함
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  maxId?: number;
}

// ---------------- 토큰 재발급 관리 ----------------
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token!)
  );
  failedQueue = [];
};

// ---------------- Axios 인터셉터 ----------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config: any }) => {
    const originalRequest = error.config;

    // 인증 예외
    if (originalRequest.headers?.skipAuthInterceptor === "true") {
      delete originalRequest.headers.skipAuthInterceptor;
      return Promise.reject(error);
    }

    // 토큰 만료 (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        ).then((token) => {
          originalRequest.headers = {
            ...(originalRequest.headers as AxiosRequestHeaders),
            Authorization: `Bearer ${token}`,
          };
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (!newToken) throw new Error("토큰 갱신 실패");

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers = {
          ...(originalRequest.headers as AxiosRequestHeaders),
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ---------------- Board API ----------------

/** ✅ 게시글 목록 조회 (검색 + 분류 + 페이징) */
export const getBoardList = async (
  page: number = 0,
  keyword: string = "",
  searchType: string = "제목+내용",
  category: string = "전체"
) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", "10");

  if (keyword.trim()) params.append("keyword", keyword);
  if (searchType !== "제목+내용") params.append("searchType", searchType);
  if (category !== "전체") params.append("category", category);

  return api.get<PageResponse<BoardResponse>>(`/board?${params.toString()}`);
};

/** ✅ 게시글 상세 조회 */
export const getBoard = async (id: number) =>
  api.get<BoardResponse>(`/board/${id}`);

/** ✅ 조회수 증가 */
export const incrementViewCount = async (id: number) =>
  api.post(
    `/board/${id}/view`,
    {},
    { headers: { skipAuthInterceptor: "true" } }
  );

/** ✅ 게시글 생성 */
export const createBoard = async (data: BoardRequest) =>
  api.post<BoardResponse>("/board", data, {
    headers: { "Content-Type": "application/json" },
  });

/** ✅ 게시글 수정 */
export const updateBoard = async (id: number, data: BoardRequest) =>
  api.put<BoardResponse>(`/board/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });

/** ✅ 게시글 삭제 */
export const deleteBoard = async (id: number) =>
  api.delete<void>(`/board/${id}`);
