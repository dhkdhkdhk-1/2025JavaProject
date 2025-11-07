import React, { useEffect, useState } from "react";
import PieChartBox from "../../../components/chart/PieChartBox";
import { getBooks, Book } from "../../../api/BookApi";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
// import { getAdmins, User, getUsers } from "../../../api/UserApi";
// import { getAllRentals } from "../../../api/RentalApi";
import "./Dashboard.css";
import { Borrower } from "@/types/Dashboard";

interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  totalBranches: number;
  borrowedCount: number;
  returnedCount: number;
  admins: { name: string; id: string; status: string }[];
  books: Book[];
  branches: BranchResponse[];
  borrowers: Borrower[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 본/지점 메타 동시 조회 (총개수만 필요)
        const [bookPage, branchPage] = await Promise.all([
          getBooks(0, 1),
          getBranches(0, 4),
        ]);

        // ✅ DashboardData 스키마에 맞춘 목데이터
        const mock: DashboardData = {
          totalUsers: 150,
          totalBooks: bookPage.totalElements ?? 0,
          totalBranches: branchPage.totalElements ?? 0,
          borrowedCount: 75,
          returnedCount: 25,
          borrowers: [
            { name: "キム・チョルス", book: "Borrowed ID-10", id: "123" },
            { name: "イ・ヨンヒ", book: "Borrowed ID-03", id: "123" },
            { name: "パク・ジミン", book: "Borrowed ID-07", id: "123" },
          ],
          admins: [
            {
              name: "チェ・ヨンヒョン",
              id: "Admin ID: 1",
              status: "アクティブ",
            },
            {
              name: "キム・ジェファン",
              id: "Admin ID: 2",
              status: "アクティブ",
            },
            { name: "イ・ジファン", id: "Admin ID: 3", status: "アクティブ" },
            { name: "ハン・ジミン", id: "Admin ID: 4", status: "アクティブ" },
          ],
          books: [], // 지금은 필요 없으니 빈배열로 채움
          branches: branchPage.content, // BranchResponse[]
        };

        setData(mock); // ✅ 꼭 호출
      } catch (err) {
        console.error("📊 ダッシュボードデータの読み込みに失敗しました:", err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>読み込み中...</p>;

  return (
    <div className="dashboard">
      {/* 左側のチャート */}
      <div className="chart-section dashboard-card">
        <h3>貸出 / 返却 比率</h3>
        <PieChartBox
          borrowed={data.borrowedCount}
          returned={data.returnedCount}
        />
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot blue"></span> 貸出中の本の総数
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span> 返却済みの本の総数
          </div>
        </div>
      </div>

      {/* ===== 오른쪽 ===== */}
      <div className="right-section">
        <div className="top-section">
          {/* 통계 카드 */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalUsers}</span>
                <span className="stat-label">総ユーザー数</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalBooks}</span>
                <span className="stat-label">総書籍数</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalBranches}</span>
                <span className="stat-label">支店数</span>
              </div>
            </div>
          </div>

          <div className="admin-card dashboard-card">
            <h4>管理者一覧</h4>
            {data.admins.length > 0 ? (
              data.admins.map((a, idx) => (
                <div className="list-item" key={a.id ?? idx}>
                  <div className="list-item-name">
                    <span>👨‍💻 {a.name}</span>
                    <small>{a.id}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>登録された管理者がありません。</p>
            )}
          </div>
        </div>

        {/* 하단 목록 */}
        <div className="bottom-section">
          {/* 연체자 목록 */}
          <div className="list-card">
            <h4>延滞者リスト</h4>
            {data.borrowers.length > 0 ? (
              data.borrowers.map((b, idx) => (
                <div className="list-item" key={idx}>
                  <span>📖 {b.book}</span>
                  <div className="list-item-status">{b.name}</div>
                </div>
              ))
            ) : (
              <p>延滞者はいません。</p>
            )}
          </div>

          {/* 지점 목록 */}
          <div className="list-card">
            <h4>支店リスト</h4>
            {data.branches.map((b, idx) => (
              <div className="list-item" key={idx}>
                <span>🏫 {b.name}</span>
                <div className="list-item-status">ID: {b.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
