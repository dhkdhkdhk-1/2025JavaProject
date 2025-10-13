import React, { useState } from "react";
import { CheckboxField } from "./components/CheckboxField";
import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    // 로그인 처리 로직 작성
    console.log({ email, password, remember });
  };

  return (
    <div className="login-page">
      <h1 className="login-title">로그인</h1>
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
