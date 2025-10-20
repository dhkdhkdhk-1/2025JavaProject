import React, { useEffect, useState } from "react";
import "./WishList.css";
import { useNavigate } from "react-router-dom";
import { getMyWishlist, deleteWishlist, WishlistItem } from "../../api/WishlistApi";

const WishList: React.FC = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  /** ✅ 내 찜 목록 불러오기 */
  useEffect(() => {
    async function fetchWishlist() {
      try {
        setLoading(true);
        const data = await getMyWishlist();
        setWishlist(data);
      } catch (e) {
        setErr("찜 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  /** ✅ 찜 해제 */
  const handleRemove = async (bookId: number) => {
    if (!window.confirm("이 도서를 찜 목록에서 제거하시겠습니까?")) return;
    try {
      await deleteWishlist(bookId);
      setWishlist((prev) => prev.filter((item) => item.bookId !== bookId));
    } catch {
      alert("찜 해제 중 오류가 발생했습니다.");
    }
  };

  /** ✅ 도서 상세보기 이동 */
  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <div className="wishlist-loading">불러오는 중...</div>;
  if (err) return <div className="wishlist-error">{err}</div>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">내 찜한 도서</h2>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>아직 찜한 도서가 없습니다 💔</p>
          <button onClick={() => navigate("/booklist")}>도서 둘러보기</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.bookId} className="wishlist-card">
              <div
                className="wishlist-image-wrapper"
                onClick={() => handleBookClick(item.bookId)}
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/200x280?text=No+Image"}
                  alt={item.bookTitle}
                  className="wishlist-image"
                />
              </div>

              <div className="wishlist-info">
                <h3
                  className="wishlist-book-title"
                  onClick={() => handleBookClick(item.bookId)}
                >
                  {item.bookTitle}
                </h3>
                <p className="wishlist-book-author">{item.author}</p>

                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(item.bookId)}
                >
                  ❌ 제거
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
