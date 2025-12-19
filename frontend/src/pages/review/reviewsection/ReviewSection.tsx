import React, { useEffect, useState } from "react";
import "./ReviewSection.css";
import { getTopReviewsByBookId, Review } from "../../../api/ReviewApi";

interface ReviewProps {
  bookId: number;
  limit?: number;
  sort?: "RATING" | "DEFAULT";
  onMoreClick?: () => void;
}

const ReviewSection: React.FC<ReviewProps> = ({
  bookId,
  limit,
  sort = "DEFAULT",
  onMoreClick,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
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

  if (loading) return <div style={{ padding: 16 }}>レビューを読み込み中...</div>;
  if (error) return <div style={{ padding: 16, color: "crimson" }}>{error}</div>;
  if (reviews.length === 0)
    return <div style={{ padding: 16 }}>登録されたレビューはありません。</div>;

  // ⭐ 정렬 로직 (요구사항 그대로)
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "RATING") {
      if (a.rating != null && b.rating != null) {
        return b.rating - a.rating;
      }
      if (a.rating != null) return -1;
      if (b.rating != null) return 1;
      return a.id - b.id;
    }
    return a.id - b.id;
  });

  const displayedReviews = limit
    ? sortedReviews.slice(0, limit)
    : sortedReviews;

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
                  <svg key={i} className="star-icon" viewBox="0 0 20 20">
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
