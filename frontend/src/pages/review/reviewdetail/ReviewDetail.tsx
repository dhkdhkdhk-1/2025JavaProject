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
        alert("유효하지 않은 리뷰 ID입니다.");
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
        console.error("리뷰 상세 조회 실패:", err);
        alert("리뷰를 불러오는 중 문제가 발생했습니다.");
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

    const confirmed = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteReview(review.id);
      alert("리뷰가 삭제되었습니다.");
      navigate(`/book/${review.bookId}`);
    } catch (err) {
      console.error("리뷰 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="board-container">불러오는 중...</div>;
  }

  if (!review) {
    return <div className="board-container">리뷰를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="board-container">
      <h1 className="board-title">{review.title}</h1>

      <div className="board-meta">
        <div className="board-meta-row">
          <span className="board-meta-left">
            작성자: {review.username} &nbsp; | &nbsp; [리뷰]
          </span>
          <span className="board-meta-right">
            작성일: {new Date(review.createdDateTime).toLocaleString()}
          </span>
        </div>
        <div className="board-meta-row">
          <span className="board-meta-left">별점: {review.rating}</span>
        </div>
      </div>

      <div className="board-content">{review.comment}</div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate(`/review/book/${review.bookId}`)}
          style={{ marginRight: "10px" }}
        >
          목록
        </button>

        {canEditOrDelete && (
          <>
            <button
              className="board-button"
              onClick={() => navigate(`/review/edit/${review.id}`)}
              style={{ marginRight: "10px" }}
            >
              수정
            </button>
            <button
              className="board-button delete"
              onClick={handleDelete}
            >
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
