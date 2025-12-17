import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../login/Login-Variables.css";
import "../login/Login-Style.css";
import "./FindPassword.css";
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

      setTimer(180);
      setTimerActive(true);
    } else if (result === "NOT_FOUND") {
      alert("登録されていないメールです。");
    } else {
      alert("認証番号送信中にエラーが発生しました。");
    }
  };

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

    setIsVerified(true);
    alert("認証が完了しました。次へ進むボタンを押してください。");
  };

  const handleGoNext = () => {
    if (!isVerified) {
      alert("認証が完了していません。");
      return;
    }

    navigate("/reset-password", { state: { email } });
  };

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

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="fp-page">
      <TextContentTitle
        title="パスワード再設定"
        align="center"
        className="fp-title"
      />

      <div className="fp-box">
        {/* STEP 1 */}
        {step === "email" && (
          <>
            <label>Email</label>
            <input
              className="fp-input"
              type="email"
              placeholder="メールアドレスを入力してください。"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="fp-button mt-20" onClick={handleSendCode}>
              認証番号送信
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === "verify" && (
          <>
            <label>認証番号</label>
            <input
              className="fp-input"
              type="text"
              placeholder="メールに届いた認証番号を入力してください"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {timerActive && (
              <div className="fp-timer">残り時間: {formatTime(timer)}</div>
            )}

            <button className="fp-button mt-10" onClick={handleResend}>
              再送信
            </button>

            <button className="fp-button mt-20" onClick={handleVerify}>
              認証する
            </button>

            <button
              className={`fp-button mt-15 ${isVerified ? "fp-success" : ""}`}
              onClick={handleGoNext}
              disabled={!isVerified}
            >
              次へ進む
            </button>
          </>
        )}

        <div className="fp-link" onClick={() => navigate("/login")}>
          ← ログインページに戻る
        </div>
      </div>
    </div>
  );
};

export default FindPassword;
