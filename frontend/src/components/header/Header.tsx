import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/login", { replace: true });

    const handleStorageChange = () => {
      if (!localStorage.getItem("accessToken")) {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    alert("ログアウトしました。");
    navigate("/login", { replace: true });
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
        <a href="/booklist">図書一覧</a>
        <a href="/board">掲示板</a>
        <a href="/cs">お問い合わせ</a>
        <a href="/mypage">マイページ</a>
        <button className="login-btn" onClick={handleLogout}>
          ログアウト
        </button>
      </nav>
    </header>
  );
}
