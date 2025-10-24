import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Login-Variables.css";
import "../login/Login-Style.css";
import { TextContentTitle } from "../login/components/TextContentTitle"; // ✅ 로그인과 동일하게 import

const FindPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (!email.trim()) {
      alert("メールアドレスを入力してください。");
      return;
    }
    alert("パスワード再設定リンクを送信しました。");
    navigate("/login");
  };

  return (
    <div className="login-page">
      {/* ✅ 로그인 페이지와 동일한 타이틀 */}
      <TextContentTitle
        title="パスワード再設定"
        align="center"
        className="login-title"
      />

      <div className="login-box">
        <label>Email</label>
        <input
          className="login-input-field"
          type="email"
          placeholder="メールアドレスを入力してください。"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="login-button"
          style={{ marginTop: "20px" }}
          onClick={handleSend}
        >
          パスワード再設定
        </button>

        <div
          className="clickable"
          style={{ marginTop: "10px", textAlign: "center" }}
          onClick={() => navigate("/login")}
        >
          ← ログインページに戻る
        </div>
      </div>
    </div>
  );
};

export default FindPassword;
