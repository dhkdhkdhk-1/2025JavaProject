import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Login-Variables.css";
import "../login/Login-Style.css";
import { TextContentTitle } from "../login/components/TextContentTitle";

// ➕ API 함수 가져오기 (경로는 프로젝트에 맞게 수정)
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from "../../api/AuthApi";

const FindPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  // 📌 이메일 유효성 검사
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // 📌 1) 인증번호 보내기
  const handleSendCode = async () => {
    if (!email.trim()) {
      alert("メールアドレスを入力してください。");
      return;
    }

    if (!isValidEmail(email)) {
      alert("メール形式が正しくありません。");
      return;
    }

    const result = await sendPasswordResetCode(email);

    if (result === "OK") {
      // 정상 → 인증번호 화면으로 이동
      alert("認証番号をメールに送信しました。");
      setStep("verify");
    } else if (result === "NOT_FOUND") {
      alert("登録されていないメールです。");
    } else {
      alert("認証番号送信中にエラーが発生しました。");
    }
  };

  // 📌 2) 인증번호 확인
  const handleVerify = async () => {
    if (!code.trim()) {
      alert("認証番号を入力してください。");
      return;
    }

    const verified = await verifyPasswordResetCode(email, code);

    if (verified) {
      alert("認証が完了しました。パスワード再設定ページに移動します。");
      navigate("/reset-password", { state: { email } });
    } else {
      alert("認証番号が正しくありません。");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle
        title="パスワード再設定"
        align="center"
        className="login-title"
      />

      <div className="login-box">
        {/* 📌 STEP 1: 이메일 입력 */}
        {step === "email" && (
          <>
            <label>Email</label>
            <input
              className="login-input-field"
              type="email"
              placeholder="メールアドレスを入力してください。"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="login-button"
              style={{ marginTop: "20px" }}
              onClick={handleSendCode}
            >
              認証番号送信
            </button>
          </>
        )}

        {/* 📌 STEP 2: 인증번호 입력 */}
        {step === "verify" && (
          <>
            <label>認証番号</label>
            <input
              className="login-input-field"
              type="text"
              placeholder="メールに届いた認証番号を入力してください"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button
              className="login-button"
              style={{ marginTop: "20px" }}
              onClick={handleVerify}
            >
              認証する
            </button>
          </>
        )}

        <div
          className="clickable"
          style={{ marginTop: "10px", textAlign: "center" }}
          onClick={() => navigate("/login")}
        >
          ← ログインページに戻る
        </div>
      </div>
    </div>
  );
};

export default FindPassword;
