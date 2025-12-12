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

  /** ✅ 이메일 중복 확인 */
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
    if (result === "OK" || result === "REJOIN") {
      setIsEmailChecked(true);
    }
  };

  /** ✅ 회원가입 처리 */
  const handleSignup = async () => {
    if (!email || !password || !passwordCheck || !username) {
      alert("すべての情報を入力してください。");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("正しい形で入力してください。(例: example@domain.com)");
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

    try {
      const result = await signup({
        email,
        username,
        password,
        passwordCheck,
        restorePosts: false,
      });

      setLoading(false);

      if (result === "EXISTS") {
        alert("既に存在しているメールです。");
        return;
      }

      // ✅ 탈퇴한 계정이라면 재가입 프로세스 시작
      if (result === "REJOIN") {
        const confirmRejoin = window.confirm(
          "以前に脱退したメールです。もう一度加入しますか？"
        );
        if (!confirmRejoin) {
          alert("再加入がキャンセルされました。");
          return;
        }

        const restore = window.confirm(
          "以前の投稿を復元しますか？\n'確認'を選びましたら再び投稿が表示されます。"
        );

        const rejoinResult = await signup({
          email,
          username,
          password,
          passwordCheck,
          restorePosts: restore,
        });

        if (rejoinResult === "OK" || rejoinResult === "REJOIN") {
          alert(
            restore
              ? "✅ アカウントと投稿が復元されました！"
              : "✅ アカウントが復元されました。投稿は引き続き非公開です。"
          );
          navigate("/login");
          return;
        } else {
          alert("再加入の途中エラーが発生しました。");
          return;
        }
      }

      if (result === "OK") {
        alert("会員登録が完了されました。");
        navigate("/login");
      } else {
        alert("会員登録に失敗しました。もう一度再確認してください。");
      }
    } catch (e) {
      console.error("会員登録失敗:", e);
      alert("サーバーにエラーが発生しました。");
      setLoading(false);
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
          label={loading ? "ロード中です..." : "会員登録"}
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
