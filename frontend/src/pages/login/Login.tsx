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

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // ⭐ 로그인 이메일 저장 여부 처리
    if (remember) localStorage.setItem("savedEmail", email);
    else localStorage.removeItem("savedEmail");

    const tokens = await login({ email, password });
    if (!tokens) {
      alert(
        "ログインに失敗しました：メールアドレスとパスワードを確認してください。"
      );
      return;
    }

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);

    try {
      const me = await getMe();

      if (me.deleted) {
        alert("脱退したアカウントです。再加入をした後に利用してください。");
        navigate("/signup");
        return;
      }

      localStorage.setItem("role", me.role);
      window.dispatchEvent(new Event("storage"));

      navigate(me.role === "ADMIN" ? "/admin" : "/home");
    } catch (e) {
      console.error("/user/me 照会失敗", e);
      alert("ログインはしましたが、会員情報の読み込みに失敗しました。");
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle title="ログイン" className="login-title" />

      <form className="login-box" onSubmit={handleLogin} autoComplete="on">
        {/* ⭐ 이메일 자동입력 완전 제거 (자동완성 리스트만 보임) */}
        <InputField
          className="login-input"
          inputClassName="login-input-field"
          label="メールアドレス"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="username"
          inputId="login-email"
          autoComplete="username"
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
            name="password"
            inputId="login-password"
            autoComplete="new-password"
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

        {/* ⭐ 로그인정보 저장 */}
        <label className="remember-container clickable-text">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>ログイン情報を保存</span>
        </label>

        {/* 회원가입 / 비밀번호 찾기 */}
        <div className="login-link-container">
          <div
            className="login-signup clickable"
            onClick={() => navigate("/signup")}
          >
            会員登録
          </div>

          <div
            className="login-forgot clickable"
            onClick={() => navigate("/findpassword")}
          >
            パスワードを探す
          </div>
        </div>

        <VariantPrimaryWrapper
          className="login-button"
          label="ログイン"
          size="medium"
          variant="primary"
        />
      </form>
    </div>
  );
};

export default Login;
