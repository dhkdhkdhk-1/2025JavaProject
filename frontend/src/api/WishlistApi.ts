// src/api/WishlistApi.ts
import { api } from "./AuthApi";

export interface WishlistItem {
  userId: number;
  bookId: number;
  bookTitle: string;
  author: string;
  imageUrl?: string | null;
  createdDateTime?: string;
}

// ✅ 찜 추가
export const addWishlist = async (bookId: number) => {
  const res = await api.post(`/wishlist/${bookId}`);
  return res.data;
};

// ✅ 찜 삭제
export const deleteWishlist = async (bookId: number) => {
  const res = await api.delete(`/wishlist/${bookId}`);
  return res.data;
};

// ✅ 내 찜 목록
export const getMyWishlist = async () => {
  const res = await api.get<WishlistItem[]>(`/wishlist/me`);
  return res.data;
};

// ✅ 특정 책 찜 여부 확인
export const isWishlisted = async (bookId: number) => {
  const res = await api.get<boolean>(`/wishlist/check/${bookId}`);
  return res.data;
};
