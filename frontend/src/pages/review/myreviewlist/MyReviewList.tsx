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
  imageUrl?: string | null;
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
        setErr("自分のレビューを読み込めませんでした。");
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  /** ✅ 리뷰 삭제 */
  const handleRemove = async (id: number) => {
    if (!window.confirm("このレビューを削除しますか？")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((item) => item.id !== id));
      alert("レビューが削除されました。");
    } catch {
      alert("レビュー削除中にエラーが発生しました。");
    }
  };

  /** ✅ 도서 상세보기 이동 */
  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <div className="reviewlist-loading">読み込み中...</div>;
  if (err) return <div className="reviewlist-error">{err}</div>;

  return (
    <div className="reviewlist-container">
      <h2 className="reviewlist-title">自分が書いたレビュー</h2>

      {reviews.length === 0 ? (
        <div className="reviewlist-empty">
          <p>まだレビューを書いていません ✏️</p>
          <button onClick={() => navigate("/booklist")}>本を見る</button>
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
                  src={
                    item.imageUrl ||
                    "https://placehold.co/357x492?text=No+Image"
                  }
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
                  ⭐ {item.rating}点 &nbsp;|&nbsp;{" "}
                  <span className="reviewlist-subtitle">{item.title}</span>
                </p>

                <p className="reviewlist-comment">
                  {item.comment.length > 80
                    ? item.comment.substring(0, 80) + "..."
                    : item.comment}
                </p>

                <button
                  className="reviewlist-remove-btn"
                  onClick={() => handleRemove(item.id)}
                >
                  🗑 削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
