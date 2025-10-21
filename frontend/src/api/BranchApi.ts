import axios from "axios";

export interface BranchResponse {
  id: number;
  name: string;
  address: string;
  managerName: string;
}

export interface BranchRequest {
  id?: number;
  name: string;
  address: string;
  managerName: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** ✅ 지점 목록 조회 (페이징) */
export const getBranches = async (
  page: number = 0,
  size: number = 10
): Promise<PageResponse<BranchResponse>> => {
  const response = await axios.get<PageResponse<BranchResponse>>(
    `${BASE_URL}/branch/list`,
    { params: { page, size } }
  );
  return response.data;
};

/** ✅ 지점 등록 */
export const addBranch = async (
  data: BranchRequest
): Promise<BranchResponse> => {
  const response = await axios.post<BranchResponse>(`${BASE_URL}/branch`, data);
  return response.data;
};

/** ✅ 지점 수정 */
export const updateBranch = async (
  data: BranchRequest
): Promise<BranchResponse> => {
  const response = await axios.put<BranchResponse>(`${BASE_URL}/branch`, data);
  return response.data;
};

/** ✅ 지점 삭제 */
export const deleteBranch = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/branch/${id}`);
};

/** ✅ 단일 지점 조회 */
export const getBranchById = async (id: number): Promise<BranchResponse> => {
  const response = await axios.get<BranchResponse>(`${BASE_URL}/branch/${id}`);
  return response.data;
};
