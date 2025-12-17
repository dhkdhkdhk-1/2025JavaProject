import React, { useEffect, useState } from "react";
import "./ReviewSection.css";
import {
  getTopReviewsByBookId,
  Review,
} from "../../../api/ReviewApi";

interface ReviewProps {
  bookId: number;
  limit?: number; // 몇 개만 보여줄지 (선택)
  onMoreClick?: () => void;
}

const ReviewSection: React.FC<ReviewProps> = ({
  bookId,
  limit,
  onMoreClick,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);

        // ✅ 책 상세용: 최신 6개 전용 API
        const data = await getTopReviewsByBookId(bookId);

        setReviews(data);
      } catch (err) {
        console.error(err);
        setError("レビューを読み込めませんでした。");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [bookId]);

<<<<<<< HEAD
  if (loading) return <div style={{ padding: 16 }}>리뷰 불러오는 중...</div>;
  if (error)
    return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;
=======
  if (loading) return <div style={{ padding: 16 }}>レビューを読み込み中...</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;
>>>>>>> main
  if (reviews.length === 0)
    return <div style={{ padding: 16 }}>登録されたレビューはありません。</div>;

  // ✅ limit 있으면 자르기 (기본은 6개 그대로)
  const displayedReviews = limit
    ? reviews.slice(0, limit)
    : reviews;

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <div className="section-header">
          <h2 className="section-title">レビュー</h2>
        </div>

        <div className="reviews-grid">
          {displayedReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="star-icon"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 1.66667L12.5743 6.88334L18.3327 7.72501L14.166 11.7833L15.1493 17.5167L10 14.8083L4.84999 17.5167L5.83333 11.7833L1.66666 7.72501L7.42499 6.88334L10 1.66667Z"
                      stroke="#2C2C2C"
                      strokeWidth="2"
                      fill={i < review.rating ? "#FFD700" : "none"}
                    />
                  </svg>
                ))}
              </div>

              <div className="review-content">
                <h3 className="review-title">{review.title}</h3>
                <p className="review-body">{review.comment}</p>
              </div>

              <div className="reviewer-details">
                <div className="reviewer-name">{review.username}</div>
                <div className="review-date">
                  {new Date(review.createdDateTime).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ 리뷰 전체 페이지로 이동 */}
        {onMoreClick && (
          <div className="view-more-reviews" onClick={onMoreClick}>
            レビューをもっと見る
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
