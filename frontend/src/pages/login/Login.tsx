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
    if (!tokens) return;

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);

    try {
      const me = await getMe();

      // ✅ 탈퇴된 계정 차단
      if (me.deleted) {
        alert("脱退したアカウントです。再加入をした後に利用してください。");
        navigate("/signup");
        return;
      }

      localStorage.setItem("role", me.role);
      window.dispatchEvent(new Event("storage"));

      if (me.role === "ADMIN") navigate("/admin");
      else navigate("/home");
    } catch (e) {
      console.error("/user/me 照会失敗", e);
      alert("ログインはしましたが、会員情報の読み込みに失敗しました。");
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle
        title="ログイン"
        align="center"
        className="login-title"
      />

      <div className="login-box">
        <InputField
          className="login-input"
          inputClassName="login-input-field"
          label="Email"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-container">
          <InputField
            className="login-input"
            inputClassName="login-input-field"
            label="Password"
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

        <div className="remember-container">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>アカウント情報保存</span>
        </div>

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
          onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default Login;
