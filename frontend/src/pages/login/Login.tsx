import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";

import { login, getMe, setAccessToken } from "../../api/AuthApi";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState(""); // 초기값 항상 빈 문자열
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // ⭐ 이메일 저장 여부에 따라 저장 또는 삭제
    if (remember) localStorage.setItem("savedEmail", email);
    else localStorage.removeItem("savedEmail");

    const tokens = await login({ email, password });
    if (!tokens) return;

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
        {/* ⭐ 자동완성 리스트는 뜨지만 자동입력은 안 됨 */}
        <InputField
          className="login-input"
          inputClassName="login-input-field"
          label="Email"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="username"
          inputId="login-email"
          autoComplete="username"
        />

        <div className="password-container">
          {/* ⭐ 비밀번호 자동완성 완전 OFF */}
          <InputField
            className="login-input"
            inputClassName="login-input-field"
            label="Password"
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

        <label className="remember-container clickable-text">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>アカウント情報保存</span>
        </label>

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
