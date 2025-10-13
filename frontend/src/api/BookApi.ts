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

export const getBooks = async (page = 0, size = 10, keyword = "") => {
  const res = await axios.get<PageResponse<Book>>(
    `${BASE_URL}/book/list?page=${page}&size=${size}&keyword=${keyword}`
  );
  return res.data;
};
