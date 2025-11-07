import React, { useEffect, useState } from "react";
import PieChartBox from "../../../components/chart/PieChartBox";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
import { getBooks } from "../../../api/BookApi"; // ✅ 追加
import "./Dashboard.css";

interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  totalBranches: number;
  borrowedRatio: number;
  returnedRatio: number;
  borrowers: { name: string; book: string }[];
  admins: { name: string; id: string; status: string }[];
  branches: BranchResponse[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        };

        setData(mock);
      } catch (err) {
        console.error("📊 ダッシュボードデータの読み込みに失敗しました:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (!data) return <p>読み込み中...</p>;

  return (
    <div className="dashboard">
      {/* 左側のチャート */}
      <div className="chart-section dashboard-card">
        <h3>貸出 / 返却 比率</h3>
        <PieChartBox
          borrowed={data.borrowedRatio}
          returned={data.returnedRatio}
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

      {/* 右側セクション */}
      <div className="right-section">
        <div className="top-section">
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
                <div className="list-item-status">{a.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 下部 */}
        <div className="bottom-section">
          <div className="list-card">
            <h4>延滞者リスト</h4>
            {data.borrowers.map((b, idx) => (
              <div className="list-item" key={idx}>
                <span>👤 {b.name}</span>
                <div className="list-item-status">{b.book}</div>
              </div>
            ))}
          </div>

          <div className="list-card">
            <h4>支店リスト</h4>
            {data.branches.map((b, idx) => (
              <div className="list-item" key={idx}>
                <span>🏫 {b.name}</span>
                <div className="list-item-status">{b.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
