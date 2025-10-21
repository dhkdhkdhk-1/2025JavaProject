import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputField } from "../login/components/InputField";
import { VariantPrimaryWrapper } from "../login/components/VariantPrimaryWrapper";
import { TextContentTitle } from "../login/components/TextContentTitle";
import { getMe, updateUserInfo } from "../../api/AuthApi";
import "./AccountInfo.css";

interface UserInfo {
  id: number;
  username: string;
  email: string;
}

const AccountInfo: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  const navigate = useNavigate();

  /** ✅ 로그인한 사용자 정보 불러오기 */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res);
        setNewNickname(res.username);
      } catch (err) {
        console.error("회원 정보를 불러오지 못했습니다.", err);
        alert("로그인이 만료되었거나 정보를 불러올 수 없습니다.");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  /** ✅ 닉네임 변경 모드 전환 */
  const handleAskEdit = () => {
    const confirmEdit = window.confirm("닉네임을 변경하시겠습니까?");
    setIsEditing(confirmEdit);
  };

  /** ✅ 회원정보 수정 요청 */
  const handleUpdate = async () => {
    if (!newNickname.trim() || !password.trim() || !passwordCheck.trim()) {
      alert("닉네임과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 🔸 AuthApi에서 수정한 부분: /user/me → /user/me/v2
      await updateUserInfo({
        username: newNickname,
        password,
        passwordCheck,
      });

      alert("닉네임이 성공적으로 변경되었습니다!");
      setIsEditing(false);

      // ✅ 최신 사용자 정보 반영
      const updatedUser = await getMe();
      setUser(updatedUser);

      navigate("/mypage");
    } catch (error: any) {
      console.error("회원 정보 수정 실패:", error);
      if (error.response?.data) {
        alert(error.response.data.message || "회원정보 수정에 실패했습니다.");
      } else {
        alert("회원정보 수정 중 오류가 발생했습니다.");
      }
    }
  };

  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="account-info-page">
      <TextContentTitle
        title="회원 정보"
        align="center"
        className="account-info-title"
      />

      <div className="account-info-box">
        {!isEditing ? (
          <>
            <p>
              <strong>닉네임:</strong> {user.username}
            </p>
            <p>
              <strong>이메일:</strong> {user.email}
            </p>

            <VariantPrimaryWrapper
              className="account-info-button"
              label="닉네임 변경"
              size="medium"
              variant="primary"
              onClick={handleAskEdit}
            />

            <button
              className="account-info-button cancel"
              onClick={() => navigate("/mypage")}
            >
              돌아가기
            </button>
          </>
        ) : (
          <>
            {/* ✅ 닉네임 입력 */}
            <InputField
              label="새 닉네임"
              value={newNickname}
              valueType="value"
              onChange={(e) => setNewNickname(e.target.value)}
            />

            {/* ✅ 비밀번호 */}
            <div className="password-container">
              <InputField
                className="account-info-input"
                inputClassName="account-info-input-field"
                label="비밀번호"
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

            {/* ✅ 비밀번호 확인 */}
            <div className="password-container">
              <InputField
                className="account-info-input"
                inputClassName="account-info-input-field"
                label="비밀번호 확인"
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
              className="account-info-button"
              label="저장"
              size="medium"
              variant="primary"
              onClick={handleUpdate}
            />

            <button
              className="account-info-button cancel"
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
