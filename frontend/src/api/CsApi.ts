import axios from "axios";

export interface CsResponse {
  id: number;
  userId: number;
  username: string;
  branchName: string;
  title: string;
  content: string;
  answerContent?: string;
  status: string;
  csCategory: string;
  createdAt: string;
}

// ✅ Axios 기본 인스턴스 설정
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 토큰 자동 추가 (요청 인터셉터)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 내 문의 내역 조회
export const getCsByUserId = async (userId: number): Promise<CsResponse[]> => {
  const res = await api.get(`/cs/user/${userId}`);
  return res.data;
};

// ✅ 문의 상세 조회 (상세페이지용)
export const getCsDetail = async (id: number): Promise<CsResponse> => {
  const res = await api.get(`/cs/${id}`);
  return res.data;
};

// ✅ 문의 등록 (등록페이지용)
export interface CsRegisterRequest {
  title: string;
  content: string;
  csCategory: string;
  branchId: number;
}

export const registerCs = async (request: CsRegisterRequest): Promise<void> => {
  await api.post("/cs", request);
};

// ✅ 문의 삭제
export const deleteCs = async (id: number): Promise<void> => {
  await api.delete(`/cs/${id}`);
};

export interface CsAnswerRequest {
  answerContent: string;
  status: "ANSWERING" | "COMPLETED";
}

// 문의 답변 달기
export const answerCs = async (id: number, request: CsAnswerRequest): Promise<void> => {
  await api.put(`/cs/${id}/answer`, request);
};
