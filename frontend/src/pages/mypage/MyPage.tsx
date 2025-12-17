import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mypage-container">
      {/* ✅ マイページ本体 */}
      <main className="mypage">
        <h2>マイページ</h2>

        <div className="mypage-grid">
          <div className="mypage-card">
<<<<<<< HEAD
            <h3>대여 이력</h3>
            <p>내가 빌린 도서의 이력을 확인하세요.</p>
            <button className="mypage-btn" onClick={() => navigate("/rental")}>
              확인하기
=======
            <h3>貸出履歴</h3>
            <p>これまでに借りた本の履歴を確認できます。</p>
            <button className="mypage-btn" onClick={() => navigate("/rental")}>
              確認する
            </button>
          </div>

          <div className="mypage-card">
            <h3>お気に入り本</h3>
            <p>お気に入りに登録した本を管理できます。</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/wishlist")}
            >
              見る
>>>>>>> main
            </button>
          </div>

          <div className="mypage-card">
<<<<<<< HEAD
            <h3>관심 도서</h3>
            <p>찜한 도서 목록을 관리할 수 있습니다.</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/wishlist")}
            >
              보러가기
=======
            <h3>レビュー管理</h3>
            <p>自分が投稿したレビューを編集・削除できます。</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/review/list")}
            >
              管理する
>>>>>>> main
            </button>
          </div>
          <div className="mypage-card">
<<<<<<< HEAD
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
            <button className="mypage-btn">수정하기</button>
          </div>

          <div className="mypage-card">
            <h3>설정</h3>
            <p>알림, 보안 등 개인 설정을 변경합니다.</p>
            <button className="mypage-btn">변경하기</button>
=======
            <h3>会員情報</h3>
            <p>アカウント情報の確認・変更ができます。</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/account-info")}
            >
              編集する
            </button>
>>>>>>> main
          </div>
        </div>
      </main>
    </div>
  );
};
export default MyPage;
