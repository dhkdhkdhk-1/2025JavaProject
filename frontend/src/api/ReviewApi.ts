// src/api/ReviewApi.ts
import { api } from "./AuthApi";

/** =========================
 *  리뷰 타입
========================= */
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

/** 페이징 응답 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

/** =========================
 *  ⭐ PUBLIC
========================= */

/** ✅ 특정 책 리뷰 전체 (백엔드 페이징) */
export const getPagedReviewsByBookId = async (
  bookId: number,
  page = 0
): Promise<PageResponse<Review>> => {
  const res = await api.get(`/reviews/book/${bookId}`, {
    params: { page },
  });
  return res.data;
};

/** ✅ 특정 책 최신 리뷰 6개 */
export const getTopReviewsByBookId = async (
  bookId: number
): Promise<Review[]> => {
  const res = await api.get(`/reviews/book/${bookId}/top`);
  return res.data;
};

/** ✅ 단일 리뷰 조회 */
export const getReview = async (id: number): Promise<Review> => {
  const res = await api.get(`/reviews/${id}`);
  return res.data;
};

/** =========================
 *  ⭐ USER (로그인 필요)
========================= */
export interface ReviewRequest {
  title: string;
  comment: string;
  rating: number;
}

/** 리뷰 작성 */
export const writeReview = async (
  bookId: number,
  data: ReviewRequest
) => {
  const res = await api.post(`/reviews/user/${bookId}`, data);
  return res.data;
};

/** 리뷰 삭제 */
export const deleteReview = async (id: number) => {
  const res = await api.delete(`/reviews/user/${id}`);
  return res.data;
};

/** 내가 쓴 리뷰 목록 */
export const getMyReviews = async () => {
  const res = await api.get(`/reviews/user/list`);
  return res.data;
};
