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
            </button>
          </div>

          <div className="mypage-card">
            <h3>レビュー管理</h3>
            <p>自分が投稿したレビューを編集・削除できます。</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/review/list")}
            >
              管理する
            </button>
          </div>
          <div className="mypage-card">
            <h3>会員情報</h3>
            <p>アカウント情報の確認・変更ができます。</p>
            <button
              className="mypage-btn"
              onClick={() => navigate("/account-info")}
            >
              編集する
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPage;
