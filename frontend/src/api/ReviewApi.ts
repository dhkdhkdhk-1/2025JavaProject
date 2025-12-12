import { api } from "./AuthApi";

/** ✅ 리뷰 데이터 타입 */
export interface Review {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: number;
  username: string;
  title: string;
  comment: string;
  rating: number;
  createdDateTime: string;
}

/** ✅ 리뷰 작성 / 수정 시 DTO */
export interface ReviewRequest {
  title: string;
  comment: string;
  rating: number;
}

/** ✅ 특정 책의 리뷰 목록 가져오기 (누구나 조회 가능) */
export const getReviewsByBookId = async (bookId: number): Promise<Review[]> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get<Review[]>(`/review/book/${bookId}`, {
    headers: { 
      Authorization: `Bearer ${token}`,  // Authorization 헤더 추가
      skipAuthInterceptor: "true"  // 비로그인도 접근 가능
    },
  });
  return res.data;
};

/** ✅ 내 리뷰 목록 가져오기 (로그인 필요) */
export const getMyReviews = async (): Promise<Review[]> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get<Review[]>(`/review/my`, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};

/** ✅ 리뷰 작성 (로그인 필요) */
export const writeReview = async (bookId: number, data: ReviewRequest) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.post(`/review/write/${bookId}`, data, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};

/** ✅ 리뷰 수정 (본인만 가능) */
export const updateReview = async (id: number, data: ReviewRequest) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.put(`/review/mod`, { id, ...data }, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};

/** ✅ 리뷰 삭제 (본인만 가능) */
export const deleteReview = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.delete(`/review/remove/${id}`, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};

/** ✅ 관리자: 전체 리뷰 목록 가져오기 */
export const getAllReviews = async (): Promise<Review[]> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get<Review[]>(`/admin/review/all`, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};

/** ✅ 관리자: 특정 리뷰 삭제 (아무 리뷰나 삭제 가능) */
export const adminDeleteReview = async (id: number) => {
  const token = localStorage.getItem("accessToken");
  const res = await api.delete(`/admin/review/remove/${id}`, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};

/** ✅ 특정 리뷰 가져오기 (단일 리뷰 조회) */
export const getReview = async (id: number): Promise<Review> => {
  const token = localStorage.getItem("accessToken");
  const res = await api.get<Review>(`/review/${id}`, {
    headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더 추가
  });
  return res.data;
};
