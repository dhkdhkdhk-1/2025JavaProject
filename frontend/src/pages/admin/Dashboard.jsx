console.log("시발");

export default function Dashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ marginBottom: "16px" }}>📊 관리자 대시보드</h1>
      <p>
        이 화면이 보이면 <strong>AdminLayout</strong>과 <strong>Sidebar</strong>
        가 잘 연결된 거야!
      </p>

      <div
        style={{
          marginTop: "24px",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3>테스트 박스</h3>
        <p>이 영역은 나중에 그래프나 통계 카드가 들어올 자리야.</p>
      </div>
    </div>
  );
}
