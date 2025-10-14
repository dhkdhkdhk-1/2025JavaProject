import axios from "axios";

const BASE_URL = "http://localhost:8080";

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  available: boolean;
}

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
  const res = await axios.get<PageResponse<Book>>(
    `${BASE_URL}/book/list?page=${page}&size=${size}&keyword=${keyword}`
  );
  return res.data;
};
