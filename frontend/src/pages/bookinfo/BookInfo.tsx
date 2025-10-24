import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewSection from "../review/reviewsection/ReviewSection";
import "./BookInfo.css";
import { getBook, BookDetail } from "../../api/BookApi";
import {
  addWishlist,
  deleteWishlist,
  isWishlisted,
} from "../../api/WishlistApi";
import { registerRental } from "../../api/RentalApi";
import { api } from "../../api/AuthApi"; // ✅ 추가 (axios 대신 사용)

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

  const placeholder = "https://placehold.co/357x492?text=No+Image"; // ✅ 안전한 이미지 URL

  /** ✅ 도서 + 지점 + 찜 여부 불러오기 */
useEffect(() => {
  async function fetchData() {
    try {
      if (!id) return;
      setLoading(true);

      // ❌ axios → ✅ api (AuthApi 인스턴스)
      const [bookRes, branchRes] = await Promise.all([
        getBook(Number(id)),
        api.get<BranchStatus[]>(`/book/${id}/branches`),
      ]);

      setBook(bookRes);
      setBranches(branchRes.data);

      const matchedBranch = branchRes.data.find((b) => b.available);
      setSelectedBranchId(matchedBranch?.branchId ?? "");

      const wishStatus = await isWishlisted(Number(id));
      setWished(wishStatus);
    } catch (e: any) {
      console.error("도서 데이터 불러오기 오류:", e);
      if (e.response?.status === 401) {
        alert("セッションが切れたか、ログインが必要です。");
        navigate("/login");
      } else {
        setErr("本の情報を取得できませんでした。");
      }
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
        alert("お気に入りを削除しました。");
      } else {
        await addWishlist(Number(id));
        setWished(true);
        alert("お気に入りに追加しました！");
      }
    } catch {
      alert("ログインが必要です。");
      navigate("/login");
    }
  };

  /** ✅ 도서 대여 */
  const handleRent = async () => {
    if (!id || !selectedBranchId) {
      alert("支店を選択してください。");
      return;
    }

    try {
      await registerRental({
        bookId: Number(id),
        branchId: Number(selectedBranchId),
      });

      alert(`「${book?.title}」を正常にレンタルしました！`);
      navigate("/rental");
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert("すでにレンタル中、またはレンタルできない本です。");
      } else if (error.response?.status === 401) {
        alert("ログインが必要です。");
        navigate("/login");
      } else {
        alert("レンタル中にエラーが発生しました。");
      }
    }
  };

  if (loading) return <div style={{ padding: 16 }}>読み込み中...</div>;
  if (err) return <div style={{ padding: 16, color: "crimson" }}>{err}</div>;
  if (!book) return <div style={{ padding: 16 }}>本が見つかりません。</div>;

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
                className="book-image"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = placeholder)
                }
              />
            </div>

            {/* 오른쪽: 도서 정보 */}
            <div className="product-details">
              <div className="breadcrumb">{book.category ?? "分類なし"}</div>

              <div className="title-section">
                <h1 className="book-title">{book.title}</h1>
                <div className="genre-tag">{book.category ?? "分類なし"}</div>
              </div>

              <div className="author-section">
                著者: {book.author} | 出版社: {book.publisher}
              </div>

              {/* ✅ 지점 선택 */}
              <div className="branch-select-section">
                <label className="location-label">支店を選択</label>
                <select
                  className="location-select"
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(Number(e.target.value))}
                >
                  <option value="">支店を選択してください</option>
                  {branches.map((b) => (
                    <option key={b.branchId} value={b.branchId}>
                      {b.branchName} — {b.available ? "貸出可能" : "貸出不可"}
                    </option>
                  ))}
                </select>

                {selectedBranch && (
                  <div
                    className={`branch-status ${
                      selectedBranch.available ? "available" : "unavailable"
                    }`}
                  >
                    {selectedBranch.available ? "貸出可能" : "貸出不可"}
                  </div>
                )}

                <div>
                  {/* ✅ 대여 버튼 */}
                  <button
                    className="rent-button"
                    disabled={!selectedBranch || !selectedBranch.available}
                    onClick={handleRent}
                  >
                    レンタル
                  </button>

                  {/* ✅ 찜 버튼 */}
                  <button
                    className={`rent-button ${wished ? "wish-active" : ""}`}
                    onClick={handleWishlist}
                  >
                    {wished ? "💖" : "🤍 "}
                  </button>
                </div>
              </div>

              {/* ✅ 책 소개 */}
              <div className="accordion-container">
                <div className="accordion-item open">
                  <div className="accordion-header">
                    <h3 className="accordion-title">本の紹介</h3>
                  </div>
                  <div className="accordion-content">
                    <p className="accordion-text">
                      {book.description ?? "紹介やあらすじの情報がありません。"}
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

              {/* ✅ 리뷰 섹션 */}
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
