import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {};

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []); // setIsLoggedIn은 React가 안정적으로 관리하므로 deps 생략 OK

  // src/layout/Header.tsx (핵심만)
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role"); // ✅ 추가
    alert("로그아웃되었습니다.");
    navigate("/login"); // ✅ 로그인 화면으로
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2
          className="logo"
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          📚 Library System
        </h2>
      </div>

      <nav className="header-right">
        <a href="/booklist">도서목록</a>
        <a href="/board">게시판</a>
        <a href="/support">고객센터</a>
        <a href="/mypage">마이페이지</a>
        <button className="login-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </nav>
    </header>
  );
}
