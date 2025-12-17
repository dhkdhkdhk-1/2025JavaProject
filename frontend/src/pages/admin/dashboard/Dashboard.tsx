import React, { useEffect, useState } from "react";
import PieChartBox from "../../../components/chart/PieChartBox";
import { getBooks } from "../../../api/BookApi";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
import { getAdmins, getUsers } from "../../../api/UserApi";
import { getAllRentals, RentalResponse } from "../../../api/RentalApi";
import "./Dashboard.css";
import { Borrower } from "@/types/Dashboard";

interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  totalBranches: number;
  borrowedCount: number;
  returnedCount: number;
  admins: { name: string; id: string; status: string }[];
  branches: BranchResponse[];
  borrowers: Borrower[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookPage, branchPage, userPage, adminPage, rentals] =
          await Promise.all([
            getBooks(0, 1), // totalBooks 용
            getBranches(0, 4), // 지점 프리뷰
            getUsers(0, 1), // totalUsers 용
            getAdmins(0, 5), // 관리자 프리뷰
            getAllRentals(), // 대여/반납/연체 계산
          ]);

        // 대여중/반납완료 카운트
        const returnedCount = rentals.filter((r) => r.returned).length;
        const borrowedCount = rentals.filter((r) => !r.returned).length;

        // 연체자 프리뷰: dueDate < 오늘 && 아직 반납 안함
        const today = new Date();
        const overdue: RentalResponse[] = rentals
          .filter((r) => !r.returned && r.dueDate)
          .filter((r) => new Date(r.dueDate) < today)
          .sort(
            (a, b) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .slice(0, 3);

        const borrowers: Borrower[] = overdue.map((r) => ({
          name: r.userName ?? "（不明）",
          book: r.bookTitle ?? `Book ID-${r.bookId}`,
          id: String(r.id),
        }));

        const dashboardData: DashboardData = {
          totalUsers: userPage.totalElements ?? 0,
          totalBooks: bookPage.totalElements ?? 0,
          totalBranches: branchPage.totalElements ?? 0,
          borrowedCount,
          returnedCount,

          admins: (adminPage.content ?? []).map((a: any) => ({
            name: a.username ?? a.name ?? "（不明）",
            id: `Admin ID: ${a.id}`,
            status: "アクティブ",
          })),

          branches: branchPage.content ?? [],
          borrowers,
        };

        setData(dashboardData);
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
                <div className="list-item" key={b.id ?? idx}>
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
              <div className="list-item" key={b.id ?? idx}>
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
