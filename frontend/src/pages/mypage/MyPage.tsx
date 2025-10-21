import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mypage-container">
      {/* ✅ 마이페이지 본문 */}
      <main className="mypage">
        <h2>마이페이지</h2>

        <div className="mypage-grid">
          <div className="mypage-card">
            <h3>대여 이력</h3>
            <p>내가 빌린 도서의 이력을 확인하세요.</p>
            <button className="mypage-btn" onClick={() => navigate("/rental")}>
              확인하기
            </button>
          </div>

          <div className="mypage-card">
            <h3>관심 도서</h3>
            <p>찜한 도서 목록을 관리할 수 있습니다.</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/wishlist")}
            >
              보러가기
            </button>
          </div>

          <div className="mypage-card">
            <h3>리뷰 관리</h3>
            <p>작성한 도서 리뷰를 수정하거나 삭제하세요.</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/reviewlist")}
            >
              관리하기
            </button>
          </div>

          <div className="mypage-card">
            <h3>회원 정보</h3>
            <p>내 계정 정보를 확인 및 수정할 수 있습니다.</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/account-info")} // ✅ 페이지 이동 추가
            >
              수정하기
            </button>
          </div>
          <div className="mypage-card">
            <h3>회원 탈퇴</h3>
            <p>회원을 탈퇴합니다.</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/withdraw")}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
