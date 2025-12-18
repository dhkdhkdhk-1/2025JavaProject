// src/pages/review/BookTotalReview.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getMe } from "../../../api/AuthApi"; // ✅ 로그인 가드
import "./BookTotalReview.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL!;

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
     ✅ 로그인 가드 + 리뷰 조회
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        /** 🔐 1. 로그인 여부 확인
         *  - 실패 시 AuthApi 인터셉터가 /login 이동
         */
        await getMe();

        /** 📖 2. 리뷰 목록 조회 (PUBLIC API) */
        const res = await axios.get<PageResponse<Review>>(
          `${BASE_URL}/reviews/book/${id}`,
          {
            params: { page },
            withCredentials: false, // JWT 헤더 방식이라 false가 안정적
          }
        );

        setReviews(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("レビューの読み込みに失敗しました", error);
        alert("レビューを呼んでくるうちの間違いが発生しました.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, page, navigate]);

  return (
    <div className="review-board-container">
      <div className="review-board-card">
        <h1 className="board-title">📖 {reviews[0]?.bookTitle} レビュー</h1>

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
                  onClick={() => navigate(`/review/detail/${r.id}`)}
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
              前へ
            </button>

            <span className="pagination-info">
              {page + 1} / {totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
            >
              次へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTotalReview;
