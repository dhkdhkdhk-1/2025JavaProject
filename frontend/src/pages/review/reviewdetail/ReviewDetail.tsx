import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReview, deleteReview, Review } from "../../../api/ReviewApi";
import { getMe, User } from "../../../api/AuthApi";
import "./ReviewDetail.css";

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [review, setReview] = useState<Review | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        alert("無効なレビューIDです");
        navigate("/review");
        return;
      }

      try {
        setLoading(true);

        /** ✅ 1. 로그인 여부 먼저 확인 */
        const me = await getMe(); // ❌ 실패 시 AuthApi에서 자동 /login 이동
        setCurrentUser(me);

        /** ✅ 2. 로그인 성공 후 리뷰 조회 */
        const reviewData = await getReview(Number(id));
        setReview(reviewData);
      } catch (err) {
        // ❗ 여기까지 왔다는 건 대부분 네트워크/404
        console.error("レビュー詳細照会失敗", err);
        alert("レビューの読み込み中に問題が発生しました");
        navigate("/review");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  /** ✅ 수정/삭제 권한 */
  const canEditOrDelete =
    currentUser &&
    review &&
    (currentUser.username === review.username ||
      currentUser.role === "MANAGER" ||
      currentUser.role === "ADMIN");

  /** ✅ 리뷰 삭제 */
  const handleDelete = async () => {
    if (!review) return;

    const confirmed = window.confirm("本当にこのレビューを削除しますか？");
    if (!confirmed) return;

    try {
      await deleteReview(review.id);
      alert("レビューが削除されました.");
      navigate(`/book/${review.bookId}`);
    } catch (err) {
      console.error("レビュー削除失敗:", err);
      alert("削除中にエラーが発生しました。");
    }
  };

  if (loading) {
    return <div className="board-container">Loading...</div>;
  }

  if (!review) {
    return <div className="board-container">レビューが見つかりません</div>;
  }

  return (
    <div className="board-container">
      <h1 className="board-title">{review.title}</h1>

      <div className="board-meta">
        <div className="board-meta-row">
          <span className="board-meta-left">
            作成者: {review.username} &nbsp; | &nbsp; [レビュー]
          </span>
          <span className="board-meta-right">
            作成日: {new Date(review.createdDateTime).toLocaleString()}
          </span>
        </div>
        <div className="board-meta-row">
          <span className="board-meta-left">評価: {review.rating}</span>
        </div>
      </div>

      <div className="board-content">{review.comment}</div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate(`/review/book/${review.bookId}`)}
          style={{ marginRight: "10px" }}
        >
          目録
        </button>

        {canEditOrDelete && (
          <>
            <button
              className="board-button"
              onClick={() => navigate(`/review/edit/${review.id}`)}
              style={{ marginRight: "10px" }}
            >
              修整
            </button>
            <button
              className="board-button delete"
              onClick={handleDelete}
            >
              削除
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
