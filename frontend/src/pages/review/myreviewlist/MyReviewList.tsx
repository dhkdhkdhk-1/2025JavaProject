import React, { useEffect, useState } from "react";
import "./MyReviewList.css";
import { useNavigate } from "react-router-dom";
import { deleteReview, getMyReviews } from "../../../api/ReviewApi";

interface ReviewItem {
  id: number;
  bookId: number;
  bookTitle: string;
  title: string;
  comment: string;
  rating: number;
  createdDateTime: string;
}

const ReviewList: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  /** ✅ 내 리뷰 불러오기 */
  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const data = await getMyReviews();
        setReviews(data);
      } catch {
        setErr("내 리뷰를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  /** ✅ 리뷰 삭제 */
  const handleRemove = async (id: number) => {
    if (!window.confirm("이 리뷰를 삭제하시겠습니까?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((item) => item.id !== id));
      alert("리뷰가 삭제되었습니다.");
    } catch {
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  /** ✅ 리뷰 수정 페이지 이동 */
  const handleEdit = (review: ReviewItem) => {
    navigate(`/review/edit/${review.bookId}`, {
      state: { review }, // 기존 데이터 전달
    });
  };

  /** ✅ 도서 상세보기 이동 */
  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <div className="reviewlist-loading">불러오는 중...</div>;
  if (err) return <div className="reviewlist-error">{err}</div>;

  return (
    <div className="reviewlist-container">
      <h2 className="reviewlist-title">내가 작성한 리뷰</h2>

      {reviews.length === 0 ? (
        <div className="reviewlist-empty">
          <p>아직 작성한 리뷰가 없습니다 ✏️</p>
          <button onClick={() => navigate("/booklist")}>도서 둘러보기</button>
        </div>
      ) : (
        <div className="reviewlist-grid">
          {reviews.map((item) => (
            <div key={item.id} className="reviewlist-card">
              <div
                className="reviewlist-image-wrapper"
                onClick={() => handleBookClick(item.bookId)}
              >
                <img
                  src="https://via.placeholder.com/200x280?text=Book+Cover"
                  alt={item.bookTitle}
                  className="reviewlist-image"
                />
              </div>

              <div className="reviewlist-info">
                <h3
                  className="reviewlist-book-title"
                  onClick={() => handleBookClick(item.bookId)}
                >
                  {item.bookTitle}
                </h3>

                <p className="reviewlist-meta">
                  ⭐ {item.rating}점 &nbsp;|&nbsp;{" "}
                  <span className="reviewlist-subtitle">{item.title}</span>
                </p>

                <p className="reviewlist-comment">
                  {item.comment.length > 80
                    ? item.comment.substring(0, 80) + "..."
                    : item.comment}
                </p>

                <div className="reviewlist-btn-group">
                  <button
                    className="reviewlist-edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    ✏ 수정
                  </button>
                  <button
                    className="reviewlist-remove-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    🗑 삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
