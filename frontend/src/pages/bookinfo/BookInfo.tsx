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
import { api } from "../../api/AuthApi";

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

  const placeholder = "https://placehold.co/357x492?text=No+Image";

  /* =========================
     ⭐ 초기 데이터 로딩
  ========================= */
  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        setLoading(true);

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
      } catch (e) {
        console.error("図書データ読み込みエラー", e);
        setErr("本の情報を取得できませんでした。");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  /* =========================
     ⭐ 찜하기
  ========================= */
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
      alert("お気に入り処理でエラーが発生しました。");
    }
  };

  /* =========================
     ⭐ 대여
  ========================= */
  const handleRent = async () => {
    if (!id || !selectedBranchId) {
      alert("支店を選択してください。");
      return;
    }

    const proceed = window.confirm(
      "3日以内に支店で受け取ってください。進めますか？"
    );
    if (!proceed) return;

    try {
      await registerRental({
        bookId: Number(id),
        branchId: Number(selectedBranchId),
      });

      alert(`「${book?.title}」を正常にレンタルしました！`);
      navigate("/rental");
    } catch {
      alert("レンタル中にエラーが発生しました。");
    }
  };

  /* =========================
     ⭐ UI
  ========================= */
  if (loading) return <div style={{ padding: 16 }}>読み込み中...</div>;
  if (err) return <div style={{ padding: 16, color: "crimson" }}>{err}</div>;
  if (!book) return <div style={{ padding: 16 }}>本が見つかりません。</div>;

  const selectedBranch = branches.find(
    (b) => b.branchId === selectedBranchId
  );

  return (
    <div className="book-info-page">
      <section className="product-section">
        <div className="product-container">
          <div className="product-content">

            {/* 도서 이미지 */}
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

            {/* 도서 정보 */}
            <div className="product-details">
              <div className="breadcrumb">
                {book.category ?? "分類なし"}
              </div>

              <div className="title-section">
                <h1 className="book-title">{book.title}</h1>
                <div className="genre-tag">
                  {book.category ?? "分類なし"}
                </div>
              </div>

              <div className="author-section">
                著者: {book.author} | 出版社: {book.publisher}
              </div>

              {/* 지점 선택 */}
              <div className="branch-select-section">
                <label className="location-label">支店を選択</label>
                <select
                  className="location-select"
                  value={selectedBranchId}
                  onChange={(e) =>
                    setSelectedBranchId(Number(e.target.value))
                  }
                >
                  <option value="">支店を選択してください</option>
                  {branches.map((b) => (
                    <option key={b.branchId} value={b.branchId}>
                      {b.branchName} —{" "}
                      {b.available ? "貸出可能" : "貸出不可"}
                    </option>
                  ))}
                </select>

                {selectedBranch && (
                  <div
                    className={`branch-status ${
                      selectedBranch.available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {selectedBranch.available
                      ? "貸出可能"
                      : "貸出不可"}
                  </div>
                )}

                <div className="action-buttons">
                  <button
                    className="rent-button"
                    disabled={
                      !selectedBranch || !selectedBranch.available
                    }
                    onClick={handleRent}
                  >
                    レンタル
                  </button>

                  <button
                    className={`rent-button ${
                      wished ? "wish-active" : ""
                    }`}
                    onClick={handleWishlist}
                  >
                    {wished ? "💖" : "🤍"}
                  </button>
                </div>
              </div>

              {/* 평점 */}
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={
                      i < Math.round(book.rating ?? 0)
                        ? "#FFD700"
                        : "none"
                    }
                    stroke="#2C2C2C"
                    strokeWidth="2"
                  >
                    <path d="M12 2L14.9 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.26L12 2Z" />
                  </svg>
                ))}
                <span style={{ marginLeft: 8, fontWeight: 600 }}>
                  {book.rating?.toFixed(1) ?? "0.0"}
                </span>
              </div>

              {/* 리뷰 미리보기 */}
              <ReviewSection
                bookId={Number(id)}
                limit={2}
                onMoreClick={() =>
                  navigate(`/review/book/${id}`)
                }
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default BookInfo;
