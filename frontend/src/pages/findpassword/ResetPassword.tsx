import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../login/Login-Variables.css";
import "../login/Login-Style.css";
import "./ResetPassword.css"; // ⬅️ 추가
import { TextContentTitle } from "../login/components/TextContentTitle";
import { resetPassword } from "../../api/AuthApi";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  if (!email) {
    alert("メール情報がありません。もう一度やり直してください。");
    navigate("/find-password");
  }

  const handleReset = async () => {
    if (!password || !passwordCheck) {
      alert("パスワードを入力してください。");
      return;
    }

    if (password !== passwordCheck) {
      alert("パスワードが一致しません。");
      return;
    }

    const ok = await resetPassword(email, password);
    if (ok) {
      alert("パスワードが正常に変更されました。");
      navigate("/login");
    } else {
      alert("パスワード変更に失敗しました。");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle
        title="新しいパスワード設定"
        align="center"
        className="login-title"
      />

      <div className="login-box">
        <label>新しいパスワード</label>
        <input
          className="login-input-field"
          type="password"
          placeholder="新しいパスワードを入力"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>パスワード確認</label>
        <input
          className="login-input-field"
          type="password"
          placeholder="もう一度入力"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        {/* 🔥 inline style 제거 */}
        <button
          type="button"
          className="login-button mt-20"
          onClick={handleReset}
        >
          パスワード変更
        </button>

        {/* 🔥 inline style 제거 */}
        <div
          className="clickable mt-10 center-text"
          onClick={() => navigate("/login")}
        >
          ← ログインページへ戻る
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
