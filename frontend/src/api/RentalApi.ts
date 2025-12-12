import { api } from "./AuthApi";

/* ======================
   타입
====================== */
export interface RentalRegisterRequest {
  bookId: number;
  branchId: number;
}

export interface RentalResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  branchName: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;   // 대여중 / 반납완료
  returned: boolean;
  userName?: string;
  userEmail?: string;
}

/* ======================
   유저 API
====================== */

// 대여 등록
export const registerRental = async (data: RentalRegisterRequest) => {
  const res = await api.post(`/rentals`, data);
  return res.data;
};

// 내 대여 목록
export const getMyRentals = async (): Promise<RentalResponse[]> => {
  const res = await api.get(`/rentals/me`);
  return res.data;
};

/* ======================
   관리자 API
====================== */

// 전체 대여 목록
export const getAllRentals = async (): Promise<RentalResponse[]> => {
  const res = await api.get(`/rentals/admin/list`);
  return res.data;
};

// 🔥 관리자 반납 처리
export const returnRental = async (rentalId: number) => {
  const res = await api.put(`/rentals/admin/return/${rentalId}`);
  return res.data;
};

// 연체 메일
export const sendReturnMail = async (rentalId: number) => {
  const res = await api.post(`/rentals/admin/notify/${rentalId}`);
  return res.data;
};
