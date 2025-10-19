import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewSection from "../review/reviewsection/ReviewSection";
import "./BookInfo.css";
import { getBook, BookDetail } from "../../api/BookApi";
import axios from "axios";
import {
  addWishlist,
  deleteWishlist,
  isWishlisted,
} from "../../api/WishlistApi";

interface BranchStatus {
  branchId: number;
  branchName: string;
  address: string;
  available: boolean;
}

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [branches, setBranches] = useState<BranchStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<number | "">("");
  const [wished, setWished] = useState(false);

  const placeholder = "https://via.placeholder.com/357x492?text=No+Image";

  /** ✅ 도서 + 지점 + 찜 여부 불러오기 */
  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        setLoading(true);

        // 도서 정보 + 지점별 상태 병렬 요청
        const [bookRes, branchRes] = await Promise.all([
          getBook(Number(id)),
          axios.get<BranchStatus[]>(`http://localhost:8080/book/${id}/branches`),
        ]);

        setBook(bookRes);
        setBranches(branchRes.data);

        // 기본 선택 (대여 가능한 지점)
        const matchedBranch = branchRes.data.find((b) => b.available);
        setSelectedBranchId(matchedBranch?.branchId ?? "");

        // ✅ 찜 여부 확인
        const wishStatus = await isWishlisted(Number(id));
        setWished(wishStatus);
      } catch (e) {
        setErr("도서 정보를 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  /** ✅ 찜하기/취소 */
  const handleWishlist = async () => {
    if (!id) return;
    try {
      if (wished) {
        await deleteWishlist(Number(id));
        setWished(false);
        alert("찜이 취소되었습니다.");
      } else {
        await addWishlist(Number(id));
        setWished(true);
        alert("찜 목록에 추가되었습니다!");
      }
    } catch (e) {
      alert("로그인이 필요합니다.");
    }
  };

  if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
  if (err) return <div style={{ padding: 16, color: "crimson" }}>{err}</div>;
  if (!book) return <div style={{ padding: 16 }}>도서를 찾을 수 없어요.</div>;

  const selectedBranch = branches.find((b) => b.branchId === selectedBranchId);

  return (
    <div className="book-info-page">
      <section className="product-section">
        <div className="product-container">
          <div className="product-content">
            {/* 왼쪽: 도서 이미지 */}
            <div className="product-image-container">
              <img
                src={book.imageUrl || placeholder}
                alt={book.title}
                className=".book-info-page .book-image"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = placeholder)
                }
              />
            </div>

            {/* 오른쪽: 도서 정보 */}
            <div className="product-details">
              <div className="breadcrumb">
                국내 &gt; {book.category ?? "분류없음"}
              </div>

              <div className="title-section">
                <h1 className="book-title">{book.title}</h1>
                <div className="genre-tag">{book.category ?? "분류없음"}</div>
              </div>

              <div className="author-section">
                저자: {book.author} | 출판사: {book.publisher}
              </div>

              {/* ✅ 지점 선택 */}
              <div className="branch-select-section">
                <label className="location-label">지점 선택</label>
                <select
                  className="location-select"
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                >
                  <option value="">지점을 선택하세요</option>
                  {branches.map((b) => (
                    <option key={b.branchId} value={b.branchId}>
                      {b.branchName} — {b.available ? "대여 가능" : "대여 불가"}
                    </option>
                  ))}
                </select>

                {selectedBranch && (
                  <div
                    className={`branch-status ${
                      selectedBranch.available ? "available" : "unavailable"
                    }`}
                  >
                    {selectedBranch.available ? "대여 가능" : "대여 불가"}
                  </div>
                )}

                <div>
                  {/* ✅ 대여 버튼 */}
                  <button
                    className="rent-button"
                    disabled={!selectedBranch || !selectedBranch.available}
                    onClick={() => {
                      alert(
                        `지점 ${selectedBranch?.branchName}에서 "${book?.title}" 대여`
                      );
                    }}
                  >
                    대여하기
                  </button>

                  {/* ✅ 찜 버튼 */}
                  <button
                    className={`rent-button ${wished ? "wish-active" : ""}`}
                    onClick={handleWishlist}
                  >
                    {wished ? "💖 찜됨" : "🤍 찜하기"}
                  </button>
                </div>
              </div>

              {/* ✅ 책 소개 */}
              <div className="accordion-container">
                <div className="accordion-item open">
                  <div className="accordion-header">
                    <h3 className="accordion-title">책 소개</h3>
                  </div>
                  <div className="accordion-content">
                    <p className="accordion-text">
                      {book.description ?? "소개/줄거리 정보가 없습니다."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ 평균 평점 */}
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(book.rating ?? 0) ? "#FFD700" : "none"}
                    stroke="#2C2C2C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L14.9 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.26L12 2Z" />
                  </svg>
                ))}
                <span style={{ marginLeft: 8, fontWeight: 600 }}>
                  {book.rating?.toFixed(1) ?? "0.0"}
                </span>
              </div>

              {/* ✅ 리뷰 섹션 (리뷰 더보기 클릭 시 TotalReview로 이동) */}
              <ReviewSection
                bookId={Number(id)}
                limit={2}
                onMoreClick={() => navigate(`/review/book/${id}`)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookInfo;
