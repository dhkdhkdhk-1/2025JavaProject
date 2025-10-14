import React, { useState } from "react";
import { CheckboxField } from "./components/CheckboxField";
import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi"; // ✅ API 분리된 함수 import

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await login({ email, password }); // ✅ axios로 변경

    if (!result) {
      alert("로그인 실패: 이메일과 비밀번호를 확인하세요.");
      return;
    }

    // ✅ 토큰 저장
    localStorage.setItem("accessToken", result.accessToken);
    localStorage.setItem("refreshToken", result.refreshToken);
    window.dispatchEvent(new Event("storage"));

    if (window.confirm("로그인 성공! 홈 화면으로 이동하시겠습니까?")) {
      navigate("/");
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

        {/* 👁 비밀번호 입력 */}
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
