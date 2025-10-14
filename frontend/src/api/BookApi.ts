import axios from "axios";

const BASE_URL = "http://localhost:8080";

// 서버 DTO에 맞춰 최소 필드
export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  available: boolean;
  // 백엔드 응답에 있을 수도 있는 선택 필드
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

export const addBook = async (form: BookForm) => {
  const res = await axios.post(`${BASE_URL}/book`, form);
  return res.data;
};

export const updateBook = async (form: any) => {
  const res = await axios.put(`${BASE_URL}/book`, form);
  return res.data;
};

export const deleteBook = async (id: number) => {
  const res = await axios.delete(`${BASE_URL}/book/${id}`);
  return res.data;
};

export const getBooks = async (page = 0, size = 10, keyword = "") => {
  const url = `${BASE_URL}/book/list?page=${page}&size=${size}&keyword=${encodeURIComponent(
    keyword
  )}`;
  const res = await axios.get<PageResponse<Book>>(url);
  return res.data;
};

// ✅ 단건 조회 API
export const getBook = async (id: number) => {
  const res = await axios.get<BookDetail>(`${BASE_URL}/book/${id}`);
  return res.data;
};

// ✅ 홈용 최근 N권
export const getRecentBooks = async (size = 5) => {
  const res = await axios.get<Book[]>(`${BASE_URL}/book/recent?size=${size}`);
  return res.data;
};
