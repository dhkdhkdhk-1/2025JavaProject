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
  rating?: number;
  branchId?: number | null;
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

// 등록
export const addBook = async (form: BookForm) => {
  const res = await api.post(`/book`, form);
  return res.data;
};

// 수정
export const updateBook = async (form: any) => {
  const res = await api.put(`/book`, form);
  return res.data;
};

// 삭제
export const deleteBook = async (id: number) => {
  const res = await api.delete(`/book/${id}`);
  return res.data;
};

// ✅ 목록 조회 (장르 필터 추가)
export const getBooks = async (
  page = 0,
  size = 10,
  keyword = "",
  genres: string[] = []
) => {
  const genreParam = genres.length ? `&genres=${genres.join(",")}` : "";
  const res = await api.get<PageResponse<Book>>(
    `/book/list?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword)}${genreParam}&_=${Date.now()}`
  );
  return res.data;
};

// 단건 조회
export const getBook = async (id: number) => {
  const res = await api.get<BookDetail>(`/book/${id}?_=${Date.now()}`);
  return res.data;
};

// 최근 도서
export const getRecentBooks = async (size = 5) => {
  const res = await api.get<Book[]>(`/book/recent?size=${size}&_=${Date.now()}`);
  return res.data;
};

// 찜 추가
export const addFavorite = async (bookId: number): Promise<void> => {
  await api.post(`/book/favorite/${bookId}`);
};

// 찜 해제
export const removeFavorite = async (bookId: number): Promise<void> => {
  await api.delete(`/book/favorite/${bookId}`);
};

// 찜 여부 확인
export const checkFavorite = async (bookId: number): Promise<boolean> => {
  const res = await api.get<boolean>(`/book/favorite/${bookId}/check`);
  return res.data;
};
