import React, { useEffect, useState } from "react";
import "./WishList.css";
import { useNavigate } from "react-router-dom";
import { getMyWishlist, deleteWishlist, WishlistItem } from "../../api/WishlistApi";

const WishList: React.FC = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  /** ✅ ウィッシュリスト取得 */
  useEffect(() => {
    async function fetchWishlist() {
      try {
        setLoading(true);

        const data = await getMyWishlist();
        setWishlist(data.content);

        // ⭐⭐ content 배열만 꺼내기 ⭐⭐
        if (data && Array.isArray(data.content)) {
          setWishlist(data.content);
        } else {
          console.error("❌ wishlist 응답이 Page 형식입니다. content만 사용해야 합니다.", data);
          setErr("ウィッシュリストの形式が正しくありません。");
          setWishlist([]);
        }

      } catch (e) {
        console.error("❌ ウィッシュリスト読み込みエラー:", e);
        setErr("ウィッシュリストを読み込めませんでした。");
      } finally {
        setLoading(false);
      }
    }

    fetchWishlist();
  }, []);

  /** ✅ ウィッシュリスト削除 */
  const handleRemove = async (bookId: number) => {
    if (!window.confirm("この本をウィッシュリストから削除しますか？")) return;
    try {
      await deleteWishlist(bookId);
      setWishlist((prev) => prev.filter((item) => item.bookId !== bookId));
    } catch {
      alert("削除中にエラーが発生しました。");
    }
  };

  /** ✅ 本の詳細ページへ */
  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <div className="wishlist-loading">読み込み中...</div>;
  if (err) return <div className="wishlist-error">{err}</div>;

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">マイウィッシュリスト</h2>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <p>まだウィッシュリストに本がありません 💔</p>
          <button onClick={() => navigate("/booklist")}>本を探す</button>
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
                  src={
                    item.imageUrl ||
                    "https://via.placeholder.com/200x280?text=No+Image"
                  }
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
                  ❌ 削除
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
