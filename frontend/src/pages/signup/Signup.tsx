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
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
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
      alert("모든 정보를 입력해주세요.");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식을 입력해주세요. (예: example@domain.com)");
      return;
    }
    if (!isEmailChecked) {
      alert("이메일 중복확인을 먼저 진행해주세요.");
      return;
    }
    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
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
        alert("이미 존재하는 이메일입니다.");
        return;
      }

      // ✅ 탈퇴한 계정이라면 재가입 프로세스 시작
      if (result === "REJOIN") {
        const confirmRejoin = window.confirm(
          "이전에 탈퇴한 계정입니다. 재가입하시겠습니까?"
        );
        if (!confirmRejoin) {
          alert("재가입이 취소되었습니다.");
          return;
        }

        const restore = window.confirm(
          "이전 게시글을 복원하시겠습니까?\n'확인'를 선택하면 게시글이 다시 표시됩니다."
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
              ? "✅ 계정과 게시글이 복구되었습니다!"
              : "✅ 계정이 복구되었습니다. 게시글은 숨김 상태로 유지됩니다."
          );
          navigate("/login");
          return;
        } else {
          alert("재가입 중 오류가 발생했습니다.");
          return;
        }
      }

      if (result === "OK") {
        alert("회원가입이 완료되었습니다!");
        navigate("/login");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (e) {
      console.error("회원가입 실패:", e);
      alert("서버 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <TextContentTitle
        title="회원가입"
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
            중복확인
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
          label={loading ? "로딩중..." : "회원가입"}
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
