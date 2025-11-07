import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TotalReview.css";

interface ReviewResponse {
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

// ✅ 특정 책(bookId)의 리뷰 리스트 API
const getReviewsByBookId = async (bookId: number) => {
  const res = await axios.get<ReviewResponse[]>(
    `http://localhost:8080/review/book/${bookId}`
  );
  return res.data;
};

const TotalReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const PAGE_SIZE = 6;
  const PAGE_GROUP_SIZE = 9; // ✅ 한 번에 표시할 페이지 버튼 개수

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getReviewsByBookId(Number(id));

      // ✅ 최신순 정렬
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.createdDateTime).getTime() -
          new Date(a.createdDateTime).getTime()
      );

      setReviews(sortedData);
      setTotalPages(Math.ceil(sortedData.length / PAGE_SIZE));
    } catch (error: unknown) {
      console.error("レビューの取得に失敗しました:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("ログインが必要です。");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("ログインが必要です。");
      navigate("/login");
      return;
    }
    fetchReviews();
  }, [fetchReviews, navigate]);

  // ✅ 현재 페이지 그룹 계산
  const currentGroup = Math.floor(page / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages - 1);

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };

  // ✅ 현재 페이지에 표시할 리뷰
  const startIdx = page * PAGE_SIZE;
  const displayedReviews = reviews.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="review-board-container">
      <div className="review-board-card">
        <h1 className="board-title">
          📖 {displayedReviews[0]?.bookTitle ?? "レビュー"} レビュー
        </h1>

        {loading ? (
          <p style={{ textAlign: "center", color: "#777" }}>読み込み中...</p>
        ) : reviews.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            登録されたレビューはまだありません。
          </p>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <div className="header-cell col-number">番号</div>
              <div className="header-cell col-title">レビュータイトル</div>
              <div className="header-cell col-author">投稿者</div>
              <div className="header-cell col-views">評価</div>
              <div className="header-cell col-date">投稿日</div>
            </div>
            <div className="table-divider"></div>

            <div className="table-body">
              {displayedReviews.map((r, index) => (
                <div
                  key={r.id}
                  className="table-row"
                  onClick={() => navigate(`/review/detail/${r.id}`)} // ReviewDetail로 이동
                  style={{ cursor: "pointer" }}
                >
                  <div className="table-cell col-number">
                    {reviews.length - (startIdx + index)}
                  </div>
                  <div className="table-cell col-title">{r.title}</div>
                  <div className="table-cell col-author">{r.username}</div>
                  <div className="table-cell col-views">
                    {"⭐".repeat(Number(r.rating))}
                  </div>
                  <div className="table-cell col-date">
                    {new Date(r.createdDateTime).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ 페이지네이션 */}
        {reviews.length > PAGE_SIZE && (
          <div className="pagination-container">
            {/* 이전 그룹 */}
            <button
              className="pagination-btn"
              onClick={() => setPage(Math.max(startPage - 1, 0))}
              disabled={currentGroup === 0}
            >
              «
            </button>

            {/* 이전 페이지 */}
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ←
            </button>

            {/* 페이지 번호 */}
            <div className="pagination-pages">
              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`pagination-page ${
                    num === page ? "active" : ""
                  }`}
                >
                  {num + 1}
                </button>
              ))}
            </div>

            {/* 다음 페이지 */}
            <button
              className="pagination-btn"
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
            >
              →
            </button>

            {/* 다음 그룹 */}
            <button
              className="pagination-btn"
              onClick={() =>
                setPage(Math.min(endPage + 1, totalPages - 1))
              }
              disabled={endPage >= totalPages - 1}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalReview;
