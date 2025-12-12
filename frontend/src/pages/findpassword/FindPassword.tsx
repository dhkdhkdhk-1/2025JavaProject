import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Login-Variables.css";
import "../login/Login-Style.css";
import { TextContentTitle } from "../login/components/TextContentTitle";

import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from "../../api/AuthApi";

const FindPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");

  const [code, setCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /** ---------------------------------------------------
   * 📌 인증번호 보내기
   * --------------------------------------------------- */
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
      alert("認証番号をメールに送信しました。");

      setStep("verify");
      setCode("");
      setIsVerified(false);

      setTimer(180); // 3분
      setTimerActive(true);
    } else if (result === "NOT_FOUND") {
      alert("登録されていないメールです。");
    } else {
      alert("認証番号送信中にエラーが発生しました。");
    }
  };

  /** ---------------------------------------------------
   * 📌 인증번호 확인 (페이지 이동 X)
   * --------------------------------------------------- */
  const handleVerify = async () => {
    if (!code.trim()) {
      alert("認証番号を入力してください。");
      return;
    }

    if (timer <= 0) {
      alert("認証番号の有効時間が切れました。再送信してください。");
      return;
    }

    const ok = await verifyPasswordResetCode(email, code);

    if (!ok) {
      alert("認証番号が正しくありません。");
      return;
    }

    // 🔥 인증 성공
    setIsVerified(true);
    alert("認証が完了しました。次へ進むボタンを押してください。");
  };

  /** ---------------------------------------------------
   * 📌 다음 페이지로 이동
   * --------------------------------------------------- */
  const handleGoNext = () => {
    if (!isVerified) {
      alert("認証が完了していません。");
      return;
    }

    navigate("/reset-password", { state: { email } });
  };

  /** ---------------------------------------------------
   * 📌 재전송
   * --------------------------------------------------- */
  const handleResend = async () => {
    const result = await sendPasswordResetCode(email);

    if (result === "OK") {
      alert("認証番号を再送信しました。");

      setCode("");
      setIsVerified(false);

      setTimer(180);
      setTimerActive(true);
    }
  };

  /** ---------------------------------------------------
   * 📌 3분 타이머
   * --------------------------------------------------- */
  useEffect(() => {
    if (timerActive && timer > 0) {
      const id = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(id);
    }

    if (timerActive && timer <= 0) {
      setTimerActive(false);
      alert("認証番号の有効時間が切れました。再送信してください。");
    }
  }, [timerActive, timer]);

  /** 타이머 표시 */
  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="login-page">
      <TextContentTitle
        title="パスワード再設定"
        align="center"
        className="login-title"
      />

      <div className="login-box">
        {/* STEP 1: 이메일 입력 */}
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

        {/* STEP 2: 인증번호 입력 */}
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

            {/* 타이머 */}
            {timerActive && (
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginTop: "8px",
                }}
              >
                残り時間: {formatTime(timer)}
              </div>
            )}

            {/* 재송신 */}
            <button
              className="login-button"
              style={{ marginTop: "10px" }}
              onClick={handleResend}
            >
              再送信
            </button>

            {/* 인증 버튼 */}
            <button
              className="login-button"
              style={{ marginTop: "20px" }}
              onClick={handleVerify}
            >
              認証する
            </button>

            {/* 다음 버튼 */}
            <button
              className="login-button"
              style={{
                marginTop: "15px",
                backgroundColor: isVerified ? "#4CAF50" : "gray",
              }}
              onClick={handleGoNext}
              disabled={!isVerified}
            >
              次へ進む
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
