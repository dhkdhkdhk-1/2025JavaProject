import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";

import { login, getMe, setAccessToken } from "../../api/AuthApi";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const tokens = await login({ email, password });
    if (!tokens) {
      alert("ログインに失敗しました：メールアドレスとパスワードを確認してください。");
      return;
    }

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);

    try {
      const me = await getMe();

      // ✅ 추가: 탈퇴된 계정 차단
      if (me.deleted) {
        alert("탈퇴된 계정입니다. 재가입 후 이용해주세요.");
        navigate("/signup");
        return;
      }

      localStorage.setItem("role", me.role);
      window.dispatchEvent(new Event("storage"));

      if (me.role === "ADMIN") navigate("/admin");
      else navigate("/home");
    } catch (e) {
      console.error("/user/me の取得に失敗しました", e);
      alert("ログインは成功しましたが、ユーザー情報を取得できませんでした。");
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle title="ログイン" align="center" className="login-title" />

      <div className="login-box">
        <InputField
          className="login-input"
          inputClassName="login-input-field"
          label="メールアドレス"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-container">
          <InputField
            className="login-input"
            inputClassName="login-input-field"
            label="パスワード"
            value={password}
            valueType="value"
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* ✅ チェックボックス + テキストを同じ行に配置 */}
        <div className="remember-container">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>ログイン情報を保存</span>
        </div>

        {/* ✅ 会員登録 + パスワード再設定 の順番を変更 */}
        <div className="login-link-container">
          <div
            className="login-signup clickable"
            onClick={() => navigate("/signup")}
          >
            新規登録
          </div>
          <div
            className="login-forgot clickable"
            onClick={() => alert("パスワード再設定機能は準備中です。")}
          >
            パスワードをお忘れの方
          </div>
        </div>

        <VariantPrimaryWrapper
          className="login-button"
          label="ログイン"
          size="medium"
          variant="primary"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default Login;
