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
        console.error("会員情報を読み込めませんでした。", err);
        alert("セッションの有効期限が切れたか、情報を読み込めません。");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  /** ✅ 닉네임 변경 모드 전환 */
  const handleAskEdit = () => {
    const confirmEdit = window.confirm("ニックネームを変更しますか？");
    setIsEditing(confirmEdit);
  };

  /** ✅ 회원정보 수정 요청 */
  const handleUpdate = async () => {
    if (!newNickname.trim() || !password.trim() || !passwordCheck.trim()) {
      alert("すべての情報を入力してしてください。");
      return;
    }

    if (password !== passwordCheck) {
      alert("パスワードが一致してません。");
      return;
    }

    try {
      // 🔸 AuthApi에서 수정한 부분: /user/me → /user/me/v2
      await updateUserInfo({
        username: newNickname,
        password,
        passwordCheck,
      });

      alert("ニックネームが成功的に変更されました！");
      setIsEditing(false);

      // ✅ 최신 사용자 정보 반영
      const updatedUser = await getMe();
      setUser(updatedUser);

      navigate("/mypage");
    } catch (error: any) {
      console.error("会員情報修正失敗:", error);
      if (error.response?.data) {
        alert(error.response.data.message || "会員情報修正に失敗しました。");
      } else {
        alert("会員情報修正途中エラーが発生しました。");
      }
    }
  };

  if (!user) return <div>ロード中です...</div>;

  return (
    <div className="account-info-page">
      <TextContentTitle
        title="会員情報"
        align="center"
        className="account-info-title"
      />

      <div className="account-info-box">
        {!isEditing ? (
          <>
            <p>
              <strong>メール:</strong> {user.email}
            </p>
            <p>
              <strong>ニックネーム:</strong> {user.username}
            </p>
            <VariantPrimaryWrapper
              className="account-info-button"
              label="ニックネーム変更"
              size="medium"
              variant="primary"
              onClick={handleAskEdit}
            />

            <button
              className="account-info-button cancel"
              onClick={() => navigate("/mypage")}
            >
              戻る
            </button>
          </>
        ) : (
          <>
            {/* ✅ 닉네임 입력 */}
            <InputField
              label="新しいニックネーム"
              value={newNickname}
              valueType="value"
              onChange={(e) => setNewNickname(e.target.value)}
            />

            {/* ✅ 비밀번호 */}
            <div className="password-container">
              <InputField
                className="account-info-input"
                inputClassName="account-info-input-field"
                label="パスワード"
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
                label="パスワードチェック"
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
              label="保存"
              size="medium"
              variant="primary"
              onClick={handleUpdate}
            />

            <button
              className="account-info-button cancel"
              onClick={() => setIsEditing(false)}
            >
              キャンセル
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
