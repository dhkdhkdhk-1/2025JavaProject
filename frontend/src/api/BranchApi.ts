import { api } from "./AuthApi";

export interface BranchResponse {
  id: number;
  name: string;
  location: string;
}

export interface BranchRequest {
  id?: number;
  name: string;
  location: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** ✅ 지점 목록 조회 */
export const getBranches = async (
  page = 0,
  size = 10
): Promise<PageResponse<BranchResponse>> => {
  const res = await api.get<PageResponse<BranchResponse>>(
    `${BASE_URL}/branch/list`,
    { params: { page, size } }
  );
  return res.data;
};

/** ✅ 지점 등록 */
export const addBranch = async (
  data: BranchRequest
): Promise<BranchResponse> => {
  const res = await api.post<BranchResponse>(`${BASE_URL}/branch`, data);
  return res.data;
};

/** ✅ 지점 수정 */
export const updateBranch = async (
  data: BranchRequest
): Promise<BranchResponse> => {
  const res = await api.put<BranchResponse>(`${BASE_URL}/branch`, data);
  return res.data;
};

/** ✅ 지점 삭제 */
export const deleteBranch = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/branch/${id}`);
};

/** ✅ 단일 조회 */
export const getBranchById = async (id: number): Promise<BranchResponse> => {
  const res = await api.get<BranchResponse>(`${BASE_URL}/branch/${id}`);
  return res.data;
};
