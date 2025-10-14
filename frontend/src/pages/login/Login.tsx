import React, { useState } from "react";
import { CheckboxField } from "./components/CheckboxField";
import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";
import { useNavigate } from "react-router-dom";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("로그인 실패");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.dispatchEvent(new Event("storage"));

      if (window.confirm("로그인 성공! 홈 화면으로 이동하시겠습니까?")) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 실패: 이메일과 비밀번호를 확인하세요.");
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

          {/* ✅ lucide-react 없이 이모지로 대체 */}
          <button
            type="button"
            className="toggle-password-btn"
            onMouseDown={(e) => e.preventDefault()} // 포커스 유지
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
