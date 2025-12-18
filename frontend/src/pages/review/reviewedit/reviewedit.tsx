import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReviewEdit.css";
import { getBook } from "../../../api/BookApi";
import { getReview, editReview } from "../../../api/ReviewApi";

const ReviewEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // reviewId
  const navigate = useNavigate();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const review = await getReview(Number(id));
        setTitle(review.title);
        setContent(review.comment);
        setRating(review.rating);

        const bookData = await getBook(review.bookId);
        setBook(bookData);
      } catch {
        alert("レビュー情報を読み込めませんでした。");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("タイトルと内容を入力してください。");
      return;
    }

    await editReview({
      id: Number(id),
      title,
      comment: content,
      rating,
    });

    alert("レビューが修正されました.");
    navigate(`/rental`);
  };

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>図書情報が見つかりません</div>;

  return (
    <div className="review-edit-page">
      {/* 📘 도서 정보 */}
      <div className="review-edit-book-section">
        <img
          className="review-edit-book-image"
          src={book.imageUrl || "https://via.placeholder.com/300x400"}
          alt={book.title}
        />

        <div className="review-edit-book-info">
          <div className="review-edit-book-body">
            <div className="review-edit-title-section">
              <div className="review-edit-title-wrapper">
                <div className="review-edit-category">📚 {book.category}</div>
                <div className="review-edit-author">✍ {book.author}</div>
                <div className="review-edit-author">🏢 {book.publisher}</div>
              </div>

              <div>
                <span className="review-edit-book-title">
                  {book.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✏️ 리뷰 수정 */}
      <div className="review-edit-section">
        <div className="review-edit-card">
          {/* ⭐ 별점 */}
          <div className="review-edit-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <svg
                key={value}
                onClick={() => setRating(value)}
                className={`review-edit-star ${value <= rating ? "filled" : ""}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
              <path
                d="M10 1.6L12.6 6.9L18.3 7.7L14.1 11.8L15.1 17.5L10 14.8L4.9 17.5L5.8 11.8L1.7 7.7L7.4 6.9L10 1.6Z"
                stroke="#2C2C2C"
                strokeWidth="2"
                fill={value <= rating ? "#2c2c2c" : "none"}   // ⭐ 이 줄 추가
              />
            </svg>
            ))}
          </div>

          <div className="review-edit-body">
            <div className="review-edit-title-input">
              <input
                className="review-edit-title-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="レビュータイトル"
              />
            </div>

            <div className="review-edit-content-input">
              <textarea
                className="review-edit-content-field"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="レビュー内容を入力してください。"
              />
            </div>
          </div>
        </div>

        <button className="review-edit-submit" onClick={handleSubmit}>
          ✅ レビュー修正
        </button>
      </div>
    </div>
  );
};

export default ReviewEdit;
