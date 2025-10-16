// src/api/BookApi.ts
import { api } from "./AuthApi";

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  available: boolean;
  imageUrl?: string | null;
  description?: string | null;
}

export interface BookDetail extends Book {}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export interface BookForm {
  title: string;
  author: string;
  publisher: string;
  category: string;
  available: boolean;
}

// 등록/수정/삭제는 캐시 이슈와 무관
export const addBook = async (form: BookForm) => {
  const res = await api.post(`/book`, form);
  return res.data;
};

export const updateBook = async (form: any) => {
  const res = await api.put(`/book`, form);
  return res.data;
};

export const deleteBook = async (id: number) => {
  const res = await api.delete(`/book/${id}`);
  return res.data;
};

// ✅ 목록 (캐시 방지 쿼리)
export const getBooks = async (page = 0, size = 10, keyword = "") => {
  const res = await api.get<PageResponse<Book>>(
    `/book/list?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}&_=${Date.now()}`
  );
  return res.data;
};

// ✅ 단건 (캐시 방지 쿼리)
export const getBook = async (id: number) => {
  const res = await api.get<BookDetail>(`/book/${id}?_=${Date.now()}`);
  return res.data;
};

// ✅ 최근 N권 (캐시 방지 쿼리)
export const getRecentBooks = async (size = 5) => {
  const res = await api.get<Book[]>(`/book/recent?size=${size}&_=${Date.now()}`);
  return res.data;
};
