import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">📚</div>
      </div>

      <div className="footer-center">
        <h4>영남이공대학교_소프트웨어_일취반_3팀</h4>
        <p>팀장 : 권동현</p>
        <p>팀원 : 이지환 / 김지민 / 김재환</p>
      </div>
      <div className="footer-cenright">
        <br></br>
        <p>사용기술 : JAVA / React / Node.js / MySQL</p>
        <p>버전 : 1.0.0</p>
      </div>
      <div className="footer-right">
        <br></br>
        <p>개발기간 : 2025.05 ~</p>
        <p>자료공유 : Notion / GitHub</p>
      </div>
    </footer>
  );
}
