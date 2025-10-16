import axios from "axios";

export interface Review {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: number;
  username: string;
  title: string;
  comment: string;
  rating: number;
  createdDateTime: string;
}

/**
 * 특정 책의 리뷰 가져오기
 * @param bookId 조회할 책 ID
 * @returns 리뷰 배열
 */
export const getReviewsByBookId = async (bookId: number): Promise<Review[]> => {
  const response = await axios.get<Review[]>(
    `http://localhost:8080/review/book/${bookId}`
  );
  return response.data;
};
