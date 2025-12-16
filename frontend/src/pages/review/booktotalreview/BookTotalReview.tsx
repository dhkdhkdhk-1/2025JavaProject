import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BookTotalReview.css";

/* =========================
   ✅ 이 페이지 전용 BASE_URL
========================= */
const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

/* =========================
   타입
========================= */
interface Review {
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

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const BookTotalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  /* =========================
     리뷰 조회
  ========================= */
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);

        const res = await axios.get<PageResponse<Review>>(
          `${BASE_URL}/reviews/book/${id}`,
          {
            params: { page },
            withCredentials: true,
          }
        );

        setReviews(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("리뷰 불러오기 실패:", error);
        alert("리뷰를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id, page]);

  return (
    <div className="review-board-container">
      <div className="review-board-card">
        <h1 className="board-title">
          📖 {reviews[0]?.bookTitle ?? "レビュー"} レビュー
        </h1>

        {loading ? (
          <p style={{ textAlign: "center", color: "#777" }}>読み込み中...</p>
        ) : reviews.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            まだ登録されたレビューがありません。
          </p>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <div className="header-cell col-number">番号</div>
              <div className="header-cell col-title">レビュータイトル</div>
              <div className="header-cell col-author">作成者</div>
              <div className="header-cell col-views">評価</div>
              <div className="header-cell col-date">作成日</div>
            </div>

            <div className="table-divider" />

            <div className="table-body">
              {reviews.map((r, index) => (
                <div
                  key={r.id}
                  className="table-row"
                  onClick={() => navigate(`/reviews/${r.id}`)} // ✅ 경로만 수정
                  style={{ cursor: "pointer" }}
                >
                  <div className="table-cell col-number">
                    {page * 10 + index + 1}
                  </div>
                  <div className="table-cell col-title">{r.title}</div>
                  <div className="table-cell col-author">{r.username}</div>
                  <div className="table-cell col-views">
                    {"⭐".repeat(r.rating)}
                  </div>
                  <div className="table-cell col-date">
                    {new Date(r.createdDateTime).toLocaleDateString("ja-JP")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ←
            </button>

            <span className="pagination-info">
              {page + 1} / {totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages - 1))
              }
              disabled={page + 1 >= totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTotalReview;
