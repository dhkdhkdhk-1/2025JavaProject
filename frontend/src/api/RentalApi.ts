import { api } from "./AuthApi"; // ✅ axios 제거

// 대여 등록 요청 DTO
export interface RentalRegisterRequest {
  bookId: number;
  branchId: number;
}

// 반납 요청 DTO
export interface RentalReturnRequest {
  rentalId: number;
}

// 대여 내역 조회 DTO
export interface RentalResponse {
  id: number;
  bookTitle: string;
  branchName: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  returned: boolean;
}

// ✅ 도서 대여 등록
export const registerRental = async (data: RentalRegisterRequest): Promise<void> => {
  const res = await api.post(`/rental/register`, data);
  return res.data;
};

// ✅ 반납 요청
export const returnRental = async (data: RentalReturnRequest): Promise<void> => {
  const res = await api.post(`/rental/return`, data);
  return res.data;
};

// ✅ 전체 대여 내역 조회 (관리자용)
export const getAllRentals = async (): Promise<RentalResponse[]> => {
  const res = await api.get(`/rental/list`);
  return res.data;
};

// ✅ 로그인한 유저의 대여 내역 조회 (마이페이지용)
export const getMyRentals = async (): Promise<RentalResponse[]> => {
  const res = await api.get(`/rental/my`);
  return res.data;
};
