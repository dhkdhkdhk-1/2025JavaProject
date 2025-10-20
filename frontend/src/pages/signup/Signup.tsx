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
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const navigate = useNavigate();

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  /** ✅ 이메일 중복확인 */
  const handleEmailCheck = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
      return;
    }
    const success = await checkEmail(email);
    if (success) setIsEmailChecked(true);
  };

  /** ✅ 휴대폰 중복확인 */
  const handlePhoneAuth = async () => {
    if (!phone) {
      alert("휴대폰 번호를 입력해주세요.");
      return;
    }
    await verifyPhone(phone);
  };

  /** ✅ 회원가입 처리 */
  const handleSignup = async () => {
    if (!email || !password || !passwordCheck || !username || !phone) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
      return;
    }
    if (!isEmailChecked) {
      alert("이메일 중복확인을 먼저 진행해주세요.");
      return;
    }
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!/^\d{10,11}$/.test(phone)) {
      alert("전화번호는 숫자만 입력해주세요. (10~11자리)");
      return;
    }

    try {
      const result = await signup({
        email,
        password,
        passwordCheck,
        username,
        phone,
      });

      if (result === "REJOIN") {
        const confirmRejoin = window.confirm(
          "이 계정은 이전에 탈퇴한 기록이 있습니다.\n재가입하시겠습니까?"
        );
        if (confirmRejoin) {
          await signup({
            email,
            password,
            passwordCheck,
            username,
            phone,
          });
          alert("재가입이 완료되었습니다!");
          navigate("/login");
        } else {
          alert("재가입이 취소되었습니다.");
        }
        return;
      }

      if (result === "OK") {
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
        {/* 이메일 + 중복확인 */}
        <div className="input-with-button">
          <InputField
            label="Email"
            value={email}
            valueType="value"
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailChecked(false);
            }}
          />
          <button className="small-btn" onClick={handleEmailCheck}>
            중복확인
          </button>
        </div>

        <InputField
          label="Password"
          type="password"
          value={password}
          valueType="value"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputField
          label="Password Check"
          type="password"
          value={passwordCheck}
          valueType="value"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <InputField
          label="Name"
          value={username}
          valueType="value"
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="input-with-button">
          <InputField
            label="Phone"
            value={phone}
            valueType="value"
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="small-btn" onClick={handlePhoneAuth}>
            중복확인
          </button>
        </div>

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
