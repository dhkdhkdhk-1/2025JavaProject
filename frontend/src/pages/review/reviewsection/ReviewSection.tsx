import React, { useEffect, useState } from "react";
import "./ReviewSection.css";
import { getPagedReviewsByBookId, Review } from "../../../api/ReviewApi";

interface ReviewProps {
  bookId: number;
  limit?: number; // 몇 개만 보여줄지
  onMoreClick?: () => void;
}

const ReviewSection: React.FC<ReviewProps> = ({ bookId, limit, onMoreClick }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);

        // ⭐ 페이징 API 호출
        const pageData = await getPagedReviewsByBookId(bookId, 0);

        // pageData.content 가 리뷰 배열
        const data: Review[] = pageData.content;

        // 최신순 정렬
        data.sort(
          (a, b) =>
            new Date(b.createdDateTime).getTime() -
            new Date(a.createdDateTime).getTime()
        );

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

  // ⭐ limit가 있다면 일부만 표시
  const displayedReviews = limit ? reviews.slice(0, limit) : reviews;

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
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 1.66667L12.5743 6.88334L18.3327 7.72501L14.166 11.7833L15.1493 17.5167L10 14.8083L4.84999 17.5167L5.83333 11.7833L1.66666 7.72501L7.42499 6.88334L10 1.66667Z"
                      stroke="#2C2C2C"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill={i < review.rating ? "#FFD700" : "none"}
                    />
                  </svg>
                ))}
              </div>

              <div className="review-content">
                <h3 className="review-title">{review.title}</h3>
                <p className="review-body">{review.comment}</p>
              </div>

              <div className="avatar-block">
                <div className="reviewer-details">
                  <div className="reviewer-name">{review.username}</div>
                  <div className="review-date">
                    {new Date(review.createdDateTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 리뷰 더보기 */}
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
