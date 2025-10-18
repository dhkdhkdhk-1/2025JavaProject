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

// ---------------- Axios 인터셉터 ----------------
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

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config: any }) => {
    const originalRequest = error.config;

    // ✅ skipAuthInterceptor 있는 요청은 refresh 로직 제외
    if (originalRequest.headers?.skipAuthInterceptor === "true") {
      delete originalRequest.headers.skipAuthInterceptor;
      return Promise.reject(error);
    }

    // ✅ AccessToken 만료 시 토큰 재발급
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

        originalRequest.headers = {
          ...(originalRequest.headers as AxiosRequestHeaders),
          Authorization: `Bearer ${newToken}`,
        };
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
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

// ✅ 게시글 목록 조회
export const getBoardList = async (page: number = 0) =>
  api.get<{ content: BoardResponse[]; totalPages: number }>(
    `board?page=${page}&size=10`
  );

// ✅ 게시글 상세 조회
export const getBoard = async (id: number) =>
  api.get<BoardResponse>(`board/${id}`);

// ✅ 조회수 증가 (⚠️ skipAuthInterceptor 제거)
export const incrementViewCount = async (id: number) =>
  api.post(
    `board/${id}/view`,
    {},
    {
      headers: { skipAuthInterceptor: "true" }, // ✅ 토큰 붙이지 않음
    }
  );

// ✅ 게시글 생성
export const createBoard = async (data: BoardRequest) =>
  api.post<BoardResponse>("board", data, {
    headers: { "Content-Type": "application/json" },
  });

// ✅ 게시글 수정
export const updateBoard = async (id: number, data: BoardRequest) =>
  api.put<BoardResponse>(`board/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });

// ✅ 게시글 삭제
export const deleteBoard = async (id: number) =>
  api.delete<void>(`board/${id}`);
