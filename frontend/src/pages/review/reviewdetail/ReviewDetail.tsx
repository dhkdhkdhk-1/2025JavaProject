import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReview, deleteReview, Review } from "../../../api/ReviewApi"; // 리뷰 관련 API 호출
import { getMe, User } from "../../../api/AuthApi"; // 현재 로그인 사용자 확인용
import "./ReviewDetail.css";

const ReviewDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      if (!id) {
        alert("유효하지 않은 리뷰 ID입니다.");
        return;
      }

      try {
        setLoading(true);
        const res = await getReview(Number(id));  // 액세스 토큰이 포함된 API 호출
        setReview(res);

        const me = await getMe();  // 로그인된 사용자 정보 가져오기
        setCurrentUser(me);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
        alert("리뷰를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id]);

  const canEditOrDelete =
    currentUser &&
    review &&
    (currentUser.username === review.username ||
      currentUser.role === "MANAGER" ||
      currentUser.role === "ADMIN");

  const handleDelete = async () => {
    if (!review) return;
    const confirmed = window.confirm("정말로 이 리뷰를 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await deleteReview(review.id);  // 리뷰 삭제
      alert("리뷰가 삭제되었습니다.");
      navigate(`/book/${review.bookId}`);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="board-container">불러오는 중...</div>;
  if (!review) return <div className="board-container">리뷰를 찾을 수 없습니다.</div>;

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
        {/* 목록 버튼 클릭 시 TotalReview 페이지로 이동 */}
        <button
          className="board-button"
          onClick={() => navigate(`/review/book/${review.bookId}`)}  // /review 경로로 이동
          style={{ marginRight: "10px" }}
        >
          목록
        </button>

        {canEditOrDelete && (
          <>
            <button
              className="board-button"
              onClick={() => navigate(`/review/edit/${review.id}`)}  // 리뷰 수정 페이지로 이동
              style={{ marginRight: "10px" }}
            >
              수정
            </button>
            <button className="board-button delete" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewDetail;
