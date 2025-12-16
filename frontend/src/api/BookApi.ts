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
  branchId?: number | null;
  imageUrl?: string | null; // (선택) 기존 URL 유지용
  description?: string | null;
}

const buildBookFormData = (form: BookForm, file?: File | null) => {
  const fd = new FormData();

  // 🔥 핵심: book은 반드시 JSON Blob
  fd.append(
    "book",
    new Blob([JSON.stringify(form)], { type: "application/json" })
  );

  if (file instanceof File) {
    fd.append("image", file);
  }

  return fd;
};

// 등록
export const addBook = async (form: BookForm, file?: File | null) => {
  const fd = buildBookFormData(form, file);
  const res = await api.post("/book", fd);
  console.log("form", form);
  console.log("json", JSON.stringify(form));
  return res.data;
};

// 수정
export const updateBook = async (
  id: number,
  form: BookForm,
  file?: File | null
) => {
  const fd = buildBookFormData(form, file);
  const res = await api.put(`/book/${id}`, fd);
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
    `/book/list?page=${page}&size=${size}&keyword=${encodeURIComponent(
      keyword
    )}${genreParam}&_=${Date.now()}`
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
  const res = await api.get<Book[]>(
    `/book/recent?size=${size}&_=${Date.now()}`
  );
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
