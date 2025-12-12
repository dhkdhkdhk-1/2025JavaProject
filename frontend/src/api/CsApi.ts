import { api } from "./AuthApi";

// ✅ 백엔드 DTO에 맞춘 인터페이스 정의
export enum CsStatus {
  WAITING = "WAITING",
  COMPLETED = "COMPLETED",
}

export enum CsCategory {
  BOOK = "BOOK",
  ACCOUNT = "ACCOUNT",
  ETC = "ETC",
}

// ✅ 사용자 문의 목록 응답 (CsUserListResponse)
export interface CsUserListResponse {
  id: number;
  title: string;
  csCategory: CsCategory;
  csStatus: CsStatus;
  createdAt: string;
}

// ✅ 문의 상세 응답 (CsDetailResponse)
export interface CsDetailResponse {
  id: number;
  title: string;
  content: string;
  answerContent?: string;
  branchId: number;
  branchName: string;
  userId: number;
  status: CsStatus;
  category: CsCategory;
  createdAt: string;
  answerCreatedAt?: string;
}

// ✅ 페이지네이션 응답
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ✅ 관리자 문의 목록 응답 (CsAdminListResponse)
export interface CsAdminListResponse {
  id: number;
  title: string;
  csCategory: CsCategory;
  csStatus: CsStatus;
  createdAt: string;
  userId: number;
  username: string;
  email: string;
  branchId: number;
  branchName: string;
}

// ✅ 문의 등록 요청 (CsUserRegisterRequest)
export interface CsRegisterRequest {
  title: string;
  content: string;
  category: CsCategory;
  branchId: number;
}

// ✅ 내 문의 내역 조회 (페이지네이션)
export const getMyCsList = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<CsUserListResponse>> => {
  const res = await api.get<PageResponse<CsUserListResponse>>("/cs/list/me", {
    params: { page, size },
  });
  return res.data;
};

// ✅ 문의 상세 조회
export const getCsDetail = async (id: number): Promise<CsDetailResponse> => {
  const res = await api.get<CsDetailResponse>(`/cs/${id}`);
  return res.data;
};

// ✅ 문의 등록
export const registerCs = async (request: CsRegisterRequest): Promise<void> => {
  await api.post("/cs", request);
};

// ✅ 관리자 문의 목록 조회
export const getAdminCsList = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<CsAdminListResponse>> => {
  const res = await api.get<PageResponse<CsAdminListResponse>>(
    "/cs/admin/list",
    { params: { page, size } }
  );
  return res.data;
};

// ✅ 관리자 답변 요청 (CsAdminAnswerRequest)
export interface CsAdminAnswerRequest {
  answerContent: string;
}

// ✅ 관리자 답변 등록
export const answerCs = async (
  csId: number,
  request: CsAdminAnswerRequest
): Promise<void> => {
  await api.post(`/cs/admin/${csId}/answer`, request);
};
