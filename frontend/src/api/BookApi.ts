import axios from "axios";

// 백엔드 Spring Boot URL
const API_BASE_URL = "http://localhost:8080/book";

export interface Book {
  id?: number;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  available?: boolean;
  description?: string;
  imageUrl?: string;
  branchId?: number;
}

// 최신 5권 가져오기
export const getLatestBooks = async (): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { page: 0, size: 5, sort: "createdDateTime,desc" },
    });
    return response.data.content; // Page.content 배열만 반환
  } catch (error) {
    console.error("최신 책 조회 실패", error);
    return [];
  }
};

// 기존 함수 유지
export const getBookList = async (): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/list`);
    return response.data.content; // content 배열만 반환
  } catch (error) {
    console.error("책 목록 조회 실패", error);
    return [];
  }
};

export const getBooks = async (
  page: number = 0,
  size: number = 15,
  keyword: string = ""
): Promise<{ content: Book[]; totalPages: number; totalElements: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { page, size, keyword },
    });
    return response.data;
  } catch (error) {
    console.error("책 페이지 조회 실패", error);
    return { content: [], totalPages: 0, totalElements: 0 };
  }
};

export const getBook = async (id: number): Promise<Book | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`책 ${id} 조회 실패`, error);
    return null;
  }
};

export const registerBook = async (book: Book): Promise<Book | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, book);
    return response.data;
  } catch (error) {
    console.error("책 등록 실패", error);
    return null;
  }
};

export const modifyBook = async (book: Book): Promise<Book | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}`, book);
    return response.data;
  } catch (error) {
    console.error("책 수정 실패", error);
    return null;
  }
};

export const removeBook = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("책 삭제 실패", error);
    return false;
  }
};
