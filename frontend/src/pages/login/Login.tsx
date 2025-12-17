import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { InputField } from "./components/InputField";
import { VariantPrimaryWrapper } from "./components/VariantPrimaryWrapper";
import { TextContentTitle } from "./components/TextContentTitle";

import { login, getMe, setAccessToken } from "../../api/AuthApi";

import "./Login-Variables.css";
import "./Login-Style.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const [savedEmails, setSavedEmails] = useState<string[]>([]);

  const navigate = useNavigate();

  /** 저장된 이메일 로드 */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedEmails") || "[]");
    setSavedEmails(saved);
  }, []);

  /** 이메일 저장 (remember === true 일 때) */
  const saveEmailIfNeeded = (emailValue: string) => {
    let updated = [...savedEmails];

    if (!updated.includes(emailValue)) {
      updated.push(emailValue);
      localStorage.setItem("savedEmails", JSON.stringify(updated));
      setSavedEmails(updated);
    }
  };

  /** 로그인 처리 */
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const tokens = await login({ email, password });
    if (!tokens) {
      alert(
        "ログインに失敗しました：メールアドレスとパスワードを確認してください。"
      );
      return;
    }

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    setAccessToken(tokens.accessToken);

    if (remember) saveEmailIfNeeded(email);

    try {
      const me = await getMe();

      if (me.deleted) {
        alert("脱退したアカウントです。再加入後に利用してください。");
        navigate("/signup");
        return;
      }

      localStorage.setItem("role", me.role);
      navigate(me.role === "ADMIN" || me.role === "MANAGER" ? "/admin" : "/home");
    } catch {
      alert("ログインはしましたが情報読み込みに失敗しました。");
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <TextContentTitle title="ログイン" className="login-title" />

      <form className="login-box" onSubmit={handleLogin} autoComplete="off">
        {/* 이메일 입력 */}
        <div className="dropdown-wrapper" onClick={(e) => e.stopPropagation()}>
          <InputField
            className="login-input"
            inputClassName="login-input-field"
            label="Email"
            value={email}
            valueType="value"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="username"
            inputId="login-email"
            autoComplete="username" // 🔥 자동완성 활성화
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="password-container">
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

        {/* 체크박스 */}
        <label className="remember-container clickable-text">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>ログイン情報を保存</span>
        </label>

        {/* 링크 */}
        <div className="login-link-container">
          <div
            className="login-signup clickable"
            onClick={() => navigate("/signup")}
          >
            会員登録
          </div>

          <div
            className="login-forgot clickable"
            onClick={() => navigate("/findpassword")}
          >
            パスワードを探す
          </div>
        </div>

        {/* 로그인 버튼 */}
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
