import "./Header.css";

export default function Header() {
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
        <button className="login-btn">로그인</button>
      </nav>
    </header>
  );
}
