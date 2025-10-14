import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // setIsLoggedIn은 React가 안정적으로 관리하므로 deps 생략 OK

  const handleLoginClick = () => navigate("/login");
  const handleSignupClick = () => navigate("/signup");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("로그아웃되었습니다.");
    setIsLoggedIn(false);
    navigate("/");
    // ✅ 다른 컴포넌트에서도 로그인 상태 변경 감지 가능
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2>📚 Library System</h2>
      </div>

      <nav className="header-right">
        <a href="/">도서목록</a>
        <a href="/board">게시판</a>
        <a href="/support">고객센터</a>
        <a href="/mypage">마이페이지</a>

        {/* ✅ 로그인 상태에 따라 버튼 표시 */}
        {!isLoggedIn ? (
          <>
            <button className="login-btn" onClick={handleLoginClick}>
              로그인
            </button>
            <button className="login-btn" onClick={handleSignupClick}>
              회원가입
            </button>
          </>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </nav>
    </header>
  );
}
