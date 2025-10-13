import React, { useState } from "react";
import { CheckboxField } from "./components/CheckboxField";
import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

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
      console.log("로그인 성공, 받은 토큰:", data);

      // 토큰 저장
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 이후 이동 등 추가 작업
      alert("로그인 성공!");
      // 예: navigate("/books"); (react-router-dom 사용 시)
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
        <InputField
          className="login-input"
          inputClassName="login-input-field"
          label="Password"
          value={password}
          valueType="value"
          onChange={(e) => setPassword(e.target.value)}
        />
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
