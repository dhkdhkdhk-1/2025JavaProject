// src/pages/login/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CheckboxField } from "./components/CheckboxField";
import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";

import { login, getMe, setAccessToken } from "../../api/AuthApi";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  // ⬇ 컴포넌트 상태는 컴포넌트 내부에
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  // ⬇ 로그인 핸들러도 컴포넌트 내부에
  const handleLogin = async () => {
    const tokens = await login({ email, password });
    if (!tokens) {
      alert("로그인 실패: 이메일과 비밀번호를 확인하세요.");
      return;
    }

    // 1) 토큰 저장 + axios 인스턴스에 주입
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);

    try {
      // 2) 내 정보 조회
      const me = await getMe();
      localStorage.setItem("role", me.role);
      window.dispatchEvent(new Event("storage"));

      // 3) 역할별 이동
      if (me.role === "ADMIN") navigate("/admin");
      else navigate("/home");
    } catch (e) {
      console.error("/user/me 조회 실패", e);
      alert("로그인은 되었지만 사용자 정보를 불러오지 못했습니다.");
      navigate("/home");
    }
  };

  // ⬇ JSX 반환도 컴포넌트 내부에
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

        <CheckboxField
          className="login-checkbox"
          label="계정 정보 저장"
          valueType={remember ? "checked" : "unchecked"}
          onChange={(e) => setRemember(e.target.checked)}
        />

        <div className="login-forgot">비밀번호 찾기</div>

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
