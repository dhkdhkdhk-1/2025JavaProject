import { api } from "./AuthApi";

export interface WishlistItem {
  userId: number;
  bookId: number;
  bookTitle: string;
  author: string;
  imageUrl?: string | null;
  createdDateTime?: string;
}

// ★ Page 응답 타입 정의
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ✔ 찜 목록 (Page 형태)
export const getMyWishlist = async () => {
  const res = await api.get<PageResponse<WishlistItem>>(`/wishlist/me`);
  return res.data;
};

export const addWishlist = async (bookId: number) => {
  const res = await api.post(`/wishlist/${bookId}`);
  return res.data;
};

export const deleteWishlist = async (bookId: number) => {
  const res = await api.delete(`/wishlist/${bookId}`);
  return res.data;
};

export const isWishlisted = async (bookId: number) => {
  const res = await api.get<boolean>(`/wishlist/${bookId}/exists`);
  return res.data;
};
