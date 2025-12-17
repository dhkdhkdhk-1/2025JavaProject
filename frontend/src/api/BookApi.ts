import { api } from "./AuthApi";

/* =========================
   Entity / Response Types
========================= */

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  available: boolean;
  imageUrl?: string | null;
  description?: string | null;
  branchIds?: number[];
  rating?: number;
}

export interface BookDetail extends Book {}

/** ✅ 공통 페이지 응답 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

/* =========================
   ✅ Request DTO Types
========================= */

/**
 * ✅ BookRegisterRequest 와 1:1 매칭
 * - 한 책을 여러 지점에 등록 가능
 */
export interface BookForm {
  title: string;
  author: string;
  publisher: string;
  category: string;
  available: boolean;
  branchIds: number[];
  imageUrl?: string | null; // (선택) 기존 URL 유지용
  description?: string | null;
}

<<<<<<< HEAD
<<<<<<< HEAD


// 등록/수정/삭제는 캐시 이슈와 무관
=======
// 등록
>>>>>>> main
export const addBook = async (form: BookForm) => {
  const res = await api.post(`/book`, form);
=======
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
>>>>>>> main
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

/** ✅ 도서 삭제 */
export const deleteBook = async (id: number) => {
  const res = await api.delete(`/book/${id}`);
  return res.data;
};

/**
 * ✅ 도서 목록 조회
 * - 페이징
 * - 검색어
 * - 장르 필터
 */
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

/** ✅ 도서 단건 조회 */
export const getBook = async (id: number) => {
  const res = await api.get<BookDetail>(`/book/${id}?_=${Date.now()}`);
  return res.data;
};

/** ✅ 최근 도서 */
export const getRecentBooks = async (size = 5) => {
  const res = await api.get<Book[]>(
    `/book/recent?size=${size}&_=${Date.now()}`
  );
  return res.data;
};

<<<<<<< HEAD
<<<<<<< HEAD
/** ✅ 도서 찜 추가 */
=======
// 찜 추가
>>>>>>> main
=======
/* =========================
   Favorite (찜)
========================= */

/** 찜 추가 */
>>>>>>> main
export const addFavorite = async (bookId: number): Promise<void> => {
  await api.post(`/book/favorite/${bookId}`);
};

<<<<<<< HEAD
<<<<<<< HEAD
/** ✅ 도서 찜 해제 */
=======
// 찜 해제
>>>>>>> main
=======
/** 찜 해제 */
>>>>>>> main
export const removeFavorite = async (bookId: number): Promise<void> => {
  await api.delete(`/book/favorite/${bookId}`);
};

<<<<<<< HEAD
<<<<<<< HEAD
/** ✅ 도서 찜 여부 확인 */
=======
// 찜 여부 확인
>>>>>>> main
=======
/** 찜 여부 확인 */
>>>>>>> main
export const checkFavorite = async (bookId: number): Promise<boolean> => {
  const res = await api.get<boolean>(`/book/favorite/${bookId}/check`);
  return res.data;
};
