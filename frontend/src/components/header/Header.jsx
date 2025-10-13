import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
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
        <button className="login-btn" onClick={handleLoginClick}>
          로그인
        </button>
        <button className="login-btn">회원가입</button>
      </nav>
    </header>
  );
}
