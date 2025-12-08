import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";

import { login, getMe, setAccessToken } from "../../api/AuthApi";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState(""); // 초기값 항상 빈 문자열
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // ⭐ 이메일 저장 여부에 따라 저장 또는 삭제
    if (remember) localStorage.setItem("savedEmail", email);
    else localStorage.removeItem("savedEmail");

    const tokens = await login({ email, password });
    if (!tokens) {
      alert("ログインに失敗しました：メールアドレスとパスワードを確認してください。");
      return;
    }

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);

    try {
      const me = await getMe();

      if (me.deleted) {
        alert("脱退したアカウントです。再加入をした後に利用してください。");
        navigate("/signup");
        return;
      }

      localStorage.setItem("role", me.role);
      window.dispatchEvent(new Event("storage"));

      navigate(me.role === "ADMIN" ? "/admin" : "/home");
    } catch (e) {
<<<<<<< HEAD
      console.error("/user/me の取得に失敗しました", e);
      alert("ログインは成功しましたが、ユーザー情報を取得できませんでした。");
=======
      console.error("/user/me 照会失敗", e);
      alert("ログインはしましたが、会員情報の読み込みに失敗しました。");
>>>>>>> accountinfo
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
<<<<<<< HEAD
      <TextContentTitle title="ログイン" align="center" className="login-title" />
=======
      <TextContentTitle title="ログイン" className="login-title" />
>>>>>>> accountinfo

      <form className="login-box" onSubmit={handleLogin} autoComplete="on">
        {/* ⭐ 자동완성 리스트는 뜨지만 자동입력은 안 됨 */}
        <InputField
          className="login-input"
          inputClassName="login-input-field"
          label="メールアドレス"
          value={email}
          valueType="value"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="username"
          inputId="login-email"
          autoComplete="username"
        />

        <div className="password-container">
          {/* ⭐ 비밀번호 자동완성 완전 OFF */}
          <InputField
            className="login-input"
            inputClassName="login-input-field"
            label="パスワード"
            value={password}
            valueType="value"
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            inputId="login-password"
            autoComplete="new-password"
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

<<<<<<< HEAD
        {/* ✅ チェックボックス + テキストを同じ行に配置 */}
        <div className="remember-container">
=======
        <label className="remember-container clickable-text">
>>>>>>> accountinfo
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
<<<<<<< HEAD
          <span>ログイン情報を保存</span>
        </div>
=======
          <span>アカウント情報保存</span>
        </label>
>>>>>>> accountinfo

        {/* ✅ 会員登録 + パスワード再設定 の順番を変更 */}
        <div className="login-link-container">
          <div
            className="login-signup clickable"
            onClick={() => navigate("/signup")}
          >
<<<<<<< HEAD
            新規登録
          </div>
          <div
            className="login-forgot clickable"
            onClick={() => alert("パスワード再設定機能は準備中です。")}
          >
            パスワードをお忘れの方
=======
            会員登録
          </div>
          <div
            className="login-forgot clickable"
            onClick={() => navigate("/findpassword")}
          >
            パスワードを探す
>>>>>>> accountinfo
          </div>
        </div>

        <VariantPrimaryWrapper
          className="login-button"
          label="ログイン"
          size="medium"
          variant="primary"
        />
      </form>
    </div>
  );
};

export default Login;
