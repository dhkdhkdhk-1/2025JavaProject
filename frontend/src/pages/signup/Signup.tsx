import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputField } from "../login/components/InputField";
import { VariantPrimaryWrapper } from "../login/components/VariantPrimaryWrapper";
import { TextContentTitle } from "../login/components/TextContentTitle";

import { signup, checkEmail } from "../../api/AuthApi";

import "./Signup-Variables.css";
import "./Signup-Style.css";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [username, setUsername] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  /** 이메일 중복 확인 */
  const handleEmailCheck = async () => {
    if (!email.trim()) return alert("メールを入力してください。");
    if (!emailRegex.test(email))
      return alert("正しい形で入力してください。(例: example@domain.com)");

    const result = await checkEmail(email);

    // 🔥 재가입 계정일 때 → alert를 사용하지 않고 confirm만 띄우기
    if (result.rejoin) {
      const confirmRejoin = window.confirm(
        "脱退したアカウントです。再加入しますか？"
      );
      if (!confirmRejoin) return;

      setIsEmailChecked(true);
      return;
    }

    // 🔥 신규 계정일 때 → alert로 "사용 가능한 이메일입니다" 메시지 출력
    alert(result.message);

    setIsEmailChecked(true);
  };

  /** 회원가입 처리 */
  const handleSignup = async () => {
    if (!email || !password || !passwordCheck || !username) {
      alert("すべての情報を入力してください。");
      return;
    }

    if (!isEmailChecked) {
      alert("先にメールの重複確認をしてください。");
      return;
    }

    if (password !== passwordCheck) {
      alert("パスワードが一致していません。");
      return;
    }

    setLoading(true);

    // 🔥 1단계 요청
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

    if (result === "REJOIN") {
      const confirmRejoin = window.confirm(
        "以前に脱退したアカウントです。再加入しますか？"
      );

      if (!confirmRejoin) return;

      const restore = window.confirm("以前の投稿を復元しますか？");

      const second = await signup({
        email,
        username,
        password,
        passwordCheck,
        restorePosts: restore,
        rejoinConfirm: true,
      });

      if (second === "OK") {
        alert(
          restore
            ? "アカウントと投稿が復元されました。"
            : "アカウントが復元されました。（投稿は非公開のままです）"
        );
        navigate("/login");
      }

      return;
    }

    if (result === "OK") {
      alert("会員登録が完了されました。");
      navigate("/login");
    }
  };

  return (
    <div className="signup-page">
      <TextContentTitle
        title="会員登録"
        align="center"
        className="signup-title"
      />

      <div className="signup-box">
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
            重複確認
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
