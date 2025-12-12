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
      alert("すべての情報を入力してください。");
      return;
    }

    if (password !== passwordCheck) {
      alert("パスワードが一致してません。");
      return;
    }

    try {
      await api.post("/auth/withdraw", { email, password, passwordCheck });

      alert("会員脱退が完了されました。");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error: any) {
      console.error("会員脱退失敗:", error);
      if (error.response?.status === 401) {
        alert("パスワードが正しくありません。");
      } else {
        alert("会員脱退途中エラーが発生しました。");
      }
    }
  };

  return (
    <div className="withdraw-page">
      <TextContentTitle
        title="会員退会"
        align="center"
        className="withdraw-title"
      />

      <div className="withdraw-box">
        <InputField
          label="メール"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ 비밀번호 입력칸 */}
        <div className="password-container">
          <InputField
            className="withdraw-input"
            inputClassName="withdraw-input-field"
            label="パスワード"
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
            label="パスワード確認"
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
          label="会員退会"
          size="medium"
          variant="primary"
          onClick={handleWithdraw}
        />

        <button
          className="withdraw-button cancel"
          onClick={() => navigate("/mypage")}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default Withdraw;
