import axios from "axios";

export interface BranchResponse {
  id: number;
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

export const getBranches = async (
  page: number = 0,
  size: number = 5
): Promise<PageResponse<BranchResponse>> => {
  const response = await axios.get<PageResponse<BranchResponse>>(
    `${BASE_URL}/branch/list`,
    {
      params: { page, size },
    }
  );
  return response.data;
};
