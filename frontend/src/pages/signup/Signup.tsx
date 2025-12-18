import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasPost } from "../../api/AuthApi";

import { InputField } from "../login/components/InputField";
import { VariantPrimaryWrapper } from "../login/components/VariantPrimaryWrapper";
import { TextContentTitle } from "../login/components/TextContentTitle";

import {
  signup,
  checkEmail,
  sendSignupVerifyCode,
  verifySignupCode,
  checkUsername,
} from "../../api/AuthApi";

import "./Signup-Variables.css";
import "./Signup-Style.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [username, setUsername] = useState("");

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [verifyStep, setVerifyStep] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isRejoin, setIsRejoin] = useState(false);

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);

  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  /** --------------------------------------------------
   * 이메일 중복 확인
   * -------------------------------------------------- */
  const handleEmailCheck = async () => {
    if (!email.trim()) {
      alert("メールを入力してください。");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("正しい形で入力してください。(例: example@domain.com)");
      return;
    }

    const result = await checkEmail(email);

    // 🔥 재가입 계정일 경우
    if (result.rejoin) {
      const confirmRejoin = window.confirm(
        "脱退したアカウントです。再加入しますか？"
      );
      if (!confirmRejoin) return;

      setIsEmailChecked(true);
      setIsRejoin(true);

      // 재가입은 인증번호 불필요
      setVerifyStep(false);
      setIsVerified(false);
      setTimerActive(false);
      setTimer(0);
      return;
    }

    // 신규 계정
    alert(result.message);
    setIsEmailChecked(true);
    setIsRejoin(false);

    const sent = await sendSignupVerifyCode(email);
    if (sent) {
      alert("認証番号をメールに送信しました。");
      setVerifyStep(true);
      setTimer(180);
      setTimerActive(true);
    }
  };

  /** 인증번호 검증 */
  const handleVerifyCode = async () => {
    if (!verifyCode.trim()) {
      alert("認証番号を入力してください。");
      return;
    }

    const result = await verifySignupCode(email, verifyCode);

    if (result.expired) {
      alert("認証番号の有効期限が切れました。再送信してください。");
      setIsVerified(false);
      return;
    }

    if (!result.verified) {
      alert("認証番号が間違っています。");
      return;
    }

    alert("認証が完了しました。");
    setIsVerified(true);
    setTimerActive(false);
  };

  /** 인증번호 재전송 */
  const handleResend = async () => {
    const sent = await sendSignupVerifyCode(email);
    if (sent) {
      alert("認証番号を再送信しました。");
      setVerifyCode("");
      setTimer(180);
      setTimerActive(true);
    }
  };

  /** 닉네임 중복 확인 */
  const handleUsernameCheck = async () => {
    if (!username.trim()) {
      alert("ニックネームを入力してください。");
      return;
    }

    const res = await checkUsername(username, email);

    if (!res.available) {
      alert("既に存在しているニックネームです。");
      setIsUsernameChecked(false);
    } else {
      alert("使用可能なニックネームです。");
      setIsUsernameChecked(true);
    }
  };

  /** 3분 타이머 */
  useEffect(() => {
    if (timerActive && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }

    if (timerActive && timer <= 0) {
      setTimerActive(false);
    }
  }, [timerActive, timer]);

  /** --------------------------------------------------
   * 회원가입
   * -------------------------------------------------- */
  const handleSignup = async () => {
    if (!email || !password || !passwordCheck || !username) {
      alert("すべての情報を入力してください。");
      return;
    }

    if (!isEmailChecked) {
      alert("先にメールの重複確認をしてください。");
      return;
    }

    if (!isUsernameChecked) {
      alert("ニックネームの重複確認をしてください。");
      return;
    }

    if (!isRejoin && !isVerified) {
      alert("メール認証を完了してください。");
      return;
    }

    if (password !== passwordCheck) {
      alert("パスワードが一致していません。");
      return;
    }

    setLoading(true);

    const result = await signup({
      email,
      username,
      password,
      passwordCheck,
      restorePosts: false,
      rejoinConfirm: false,
    });

    setLoading(false);

    if (result === "EXISTS") {
      alert("既に存在しているメールです。");
      return;
    }

    if (result === "NICKNAME_EXISTS") {
      alert("既に存在しているニックネームです。");
      return;
    }

    if (result === "FAIL") {
      alert("会員登録中にエラーが発生しました。");
      return;
    }

    /** -------------------------
     *   🔥 재가입 2단계 로직
     * ------------------------- */
    if (result === "REJOIN") {
      const confirmRejoin = window.confirm(
        "以前に脱退したアカウントです。再加入しますか？"
      );
      if (!confirmRejoin) return;

      // ⭐ 게시글 존재 여부 확인 API 호출
      let existsPost = false;
      let restore = false;

      try {
        existsPost = await hasPost(email);
      } catch (err) {
        console.error("投稿確認失敗:", err);
      }

      // 게시글이 있을 때만 복구 여부 질문
      if (existsPost) {
        restore = window.confirm("以前の投稿を復元しますか？");
      }

      // 실제 재가입 요청
      const second = await signup({
        email,
        username,
        password,
        passwordCheck,
        restorePosts: restore,
        rejoinConfirm: true,
      });

      if (second === "OK") {
        if (!existsPost) {
          alert("アカウントが復元されました。");
        } else {
          alert(
            restore
              ? "アカウントと投稿が復元されました。"
              : "アカウントが復元されました。（投稿は非公開のままです）"
          );
        }
        navigate("/login");
      }

      return;
    }

    /** 신규 가입 성공 */
    if (result === "OK") {
      alert("会員登録が完了されました。");
      navigate("/login");
    }
  };

  /** 타이머 표시 */
  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

  return (
    <div className="signup-page">
      <TextContentTitle
        title="会員登録"
        align="center"
        className="signup-title"
      />

      <div className="signup-box">
        {/* 이메일 입력 */}
        <div className="input-with-button">
          <InputField
            label="Email"
            value={email}
            valueType="value"
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailChecked(false);
              setVerifyStep(false);
              setIsVerified(false);
              setIsRejoin(false);
              setTimerActive(false);
              setTimer(0);
            }}
          />
          <button className="small-btn" onClick={handleEmailCheck}>
            重複確認
          </button>
        </div>

        {/* 인증번호 UI */}
        {verifyStep && (
          <div className="verify-box verify-margin">
            <div className="input-with-button">
              <InputField
                label="認証番号"
                value={verifyCode}
                valueType="value"
                onChange={(e) => setVerifyCode(e.target.value)}
              />
              <button
                className="small-btn"
                onClick={handleVerifyCode}
                disabled={isVerified}
              >
                認証
              </button>
            </div>

            {timerActive && (
              <div className="signup-timer-text">
                残り時間: {formatTime(timer)}
              </div>
            )}

            <button className="small-btn" onClick={handleResend}>
              再送信
            </button>
          </div>
        )}

        {/* 패스워드 */}
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

        {/* 닉네임 */}
        <div className="input-with-button">
          <InputField
            label="Name"
            value={username}
            valueType="value"
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameChecked(false);
            }}
          />
          <button className="small-btn" onClick={handleUsernameCheck}>
            重複確認
          </button>
        </div>

        {/* 회원가입 버튼 */}
        <VariantPrimaryWrapper
          className="signup-button"
          label={loading ? "ロード中..." : "会員登録"}
          size="medium"
          variant="primary"
          onClick={handleSignup}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default Signup;
