// src/pages/signup/Signup.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputField } from "../login/components/InputField";
import { VariantPrimaryWrapper } from "../login/components/VariantPrimaryWrapper";
import { TextContentTitle } from "../login/components/TextContentTitle";
import { signup, checkEmail, verifyPhone } from "../../api/AuthApi";

import "./Signup-Variables.css";
import "./Signup-Style.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ 이메일 중복확인 여부
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const navigate = useNavigate();

  // ✅ 이메일 정규식 (모든 일반 이메일 도메인 허용)
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  // ✅ 이메일 중복확인
  const handleEmailCheck = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // ✅ 이메일 형식 확인 (정규식)
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
      return;
    }

    const success = await checkEmail(email);
    if (success) {
      setIsEmailChecked(true); // ✅ 중복확인 완료
    }
  };

  // ✅ 휴대폰 본인인증
  const handlePhoneAuth = async () => {
    if (!phone) {
      alert("휴대폰 번호를 입력해주세요.");
      return;
    }
    await verifyPhone(phone);
  };

  // ✅ 회원가입 처리
  const handleSignup = async () => {
    // 1️⃣ 공백 확인
    if (!email || !password || !passwordCheck || !name || !phone) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 2️⃣ 이메일 형식 확인
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
      return;
    }

    // 3️⃣ 이메일 중복확인 여부 확인
    if (!isEmailChecked) {
      alert("이메일 중복확인을 먼저 진행해주세요.");
      return;
    }

    // 4️⃣ 비밀번호 일치 확인
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 5️⃣ 전화번호 숫자 형식 확인
    if (!/^\d{10,11}$/.test(phone)) {
      alert("전화번호는 숫자만 입력해주세요. (10~11자리)");
      return;
    }

    try {
      const success = await signup({ email, password, name, phone });
      if (success) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      console.error("회원가입 실패:", e);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <TextContentTitle
        title="회원가입"
        align="center"
        className="signup-title"
      />

      <div className="signup-box">
        {/* ✅ 이메일 + 중복확인 버튼 */}
        <div className="input-with-button">
          <InputField
            label="Email"
            value={email}
            valueType="value"
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailChecked(false); // ✅ 이메일 변경 시 다시 확인 필요
            }}
          />
          <button className="small-btn" onClick={handleEmailCheck}>
            중복확인
          </button>
        </div>

        {/* ✅ 비밀번호 */}
        <InputField
          label="Password"
          type="password"
          value={password}
          valueType="value"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ 비밀번호 확인 */}
        <InputField
          label="Password Check"
          type="password"
          value={passwordCheck}
          valueType="value"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        {/* ✅ 이름 */}
        <InputField
          label="Name"
          value={name}
          valueType="value"
          onChange={(e) => setName(e.target.value)}
        />

        {/* ✅ 휴대폰 + 인증 버튼 */}
        <div className="input-with-button">
          <InputField
            label="Phone"
            value={phone}
            valueType="value"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="small-btn" onClick={handlePhoneAuth}>
            본인인증
          </button>
        </div>

        {/* ✅ 회원가입 버튼 */}
        <VariantPrimaryWrapper
          className="signup-button"
          label="회원가입"
          size="medium"
          variant="primary"
          onClick={handleSignup}
        />
      </div>
    </div>
  );
};

export default Signup;
