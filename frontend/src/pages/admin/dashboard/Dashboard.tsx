import React, { useEffect, useState } from "react";
import PieChartBox from "../../../components/chart/PieChartBox";
import { getBooks, Book } from "../../../api/BookApi";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
import { getBooks } from "../../../api/BookApi"; // ✅ 追加
import { getAdmins, User, getUsers } from "../../../api/UserApi";
import { getAllRentals } from "../../../api/RentalApi";
import "./Dashboard.css";

interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  totalBranches: number;
  borrowedCount: number;
  returnedCount: number;
  admins: { name: string; id: string; status: string }[];
  books: Book[];
  branches: BranchResponse[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 本と支店データを同時に取得
        const [bookPage, branchPage] = await Promise.all([
          getBooks(0, 1), // 本の総数のみ必要 → totalElements で取得可能
          getBranches(0, 4),
        ]);

        const mock = {
          totalUsers: 150, // 後で /user/list 連携時に DB値も利用可能
          totalBooks: bookPage.totalElements, // ✅ DBの実際の本の数
          totalBranches: branchPage.totalElements,
          borrowedRatio: 75,
          returnedRatio: 25,
          borrowers: [
            { name: "キム・チョルス", book: "Borrowed ID-10" },
            { name: "イ・ヨンヒ", book: "Borrowed ID-03" },
            { name: "パク・ジミン", book: "Borrowed ID-07" },
          ],
          admins: [
            { name: "チェ・ヨンヒョン", id: "Admin ID: 1", status: "アクティブ" },
            { name: "キム・ジェファン", id: "Admin ID: 2", status: "アクティブ" },
            { name: "イ・ジファン", id: "Admin ID: 3", status: "アクティブ" },
            { name: "ハン・ジミン", id: "Admin ID: 4", status: "アクティブ" },
          ],
          branches: branchPage.content,
        });
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
                <span className="stat-value">{data.totalBooks}</span>{" "}
                {/* ✅ DB 値反映 */}
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
            {data.admins.map((a, idx) => (
              <div className="list-item" key={idx}>
                <div className="list-item-name">
                  <span>👨‍💻 {a.name}</span>
                  <small>{a.id}</small>
                </div>
              ))
            ) : (
              <p>등록된 관리자가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 하단 목록 */}
        <div className="bottom-section">
          {/* 책 목록 */}
          <div className="list-card">
            <h4>延滞者リスト</h4>
            {data.borrowers.map((b, idx) => (
              <div className="list-item" key={idx}>
                <span>📖 {b.title}</span>
                <div className="list-item-status">ID: {b.id}</div>
              </div>
            ))}
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
