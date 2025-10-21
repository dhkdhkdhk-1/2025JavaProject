import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../login/components/InputField";
import { VariantPrimaryWrapper } from "../login/components/VariantPrimaryWrapper";
import { TextContentTitle } from "../login/components/TextContentTitle";
import { api } from "../../api/AuthApi";
import "./Withdraw.css";

const Withdraw: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const navigate = useNavigate();

  /** ✅ 회원 탈퇴 처리 */
  const handleWithdraw = async () => {
    if (!email || !password || !passwordCheck) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.post("/auth/withdraw", { email, password, passwordCheck });

      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error: any) {
      console.error("회원 탈퇴 실패:", error);
      if (error.response?.status === 401) {
        alert("비밀번호가 올바르지 않습니다.");
      } else {
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="withdraw-page">
      <TextContentTitle
        title="회원 탈퇴"
        align="center"
        className="withdraw-title"
      />

      <div className="withdraw-box">
        <InputField
          label="이메일"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ 비밀번호 입력칸 */}
        <div className="password-container">
          <InputField
            className="withdraw-input"
            inputClassName="withdraw-input-field"
            label="비밀번호"
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

        {/* ✅ 비밀번호 확인 입력칸 (동일 구조로 수정됨) */}
        <div className="password-container">
          <InputField
            className="withdraw-input"
            inputClassName="withdraw-input-field"
            label="비밀번호 확인"
            value={passwordCheck}
            valueType="value"
            onChange={(e) => setPasswordCheck(e.target.value)}
            type={showPasswordCheck ? "text" : "password"}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPasswordCheck((prev) => !prev)}
          >
            {showPasswordCheck ? "🙈" : "👁️"}
          </button>
        </div>

        <VariantPrimaryWrapper
          className="withdraw-button"
          label="회원 탈퇴"
          size="medium"
          variant="primary"
          onClick={handleWithdraw}
        />

        <button
          className="withdraw-button cancel"
          onClick={() => navigate("/mypage")}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
