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
      console.error("/user/me 조회 실패", e);
      alert("로그인은 되었지만 사용자 정보를 불러오지 못했습니다.");
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle title="로그인" align="center" className="login-title" />

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
          <span>계정 정보 저장</span>
        </div>

        <div className="login-link-container">
          <div
            className="login-signup clickable"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </div>
          <div
            className="login-forgot clickable"
            onClick={() => alert("비밀번호 찾기 기능 준비 중입니다.")}
          >
            비밀번호 찾기
          </div>
        </div>

        <VariantPrimaryWrapper
          className="login-button"
          label="로그인"
          size="medium"
          variant="primary"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default Login;
