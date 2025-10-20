import React, { useEffect, useState } from "react";
import PieChartBox from "../../../components/chart/PieChartBox";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
import { getBooks } from "../../../api/BookApi"; // ✅ 추가
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
        // ✅ 책, 지점 데이터 동시에 가져오기
        const [bookPage, branchPage] = await Promise.all([
          getBooks(0, 1), // 책 전체 개수만 필요 → 한 페이지만 가져오면 totalElements 계산 가능
          getBranches(0, 4),
        ]);

        const mock = {
          totalUsers: 150, // 나중에 /user/list 연동 시 여기도 DB값 가능
          totalBooks: bookPage.totalElements, // ✅ DB의 실제 책 개수
          totalBranches: branchPage.totalElements,
          borrowedRatio: 75,
          returnedRatio: 25,
          borrowers: [
            { name: "김철수", book: "Borrowed ID-10" },
            { name: "이영희", book: "Borrowed ID-03" },
            { name: "박지민", book: "Borrowed ID-07" },
          ],
          admins: [
            { name: "최용현", id: "Admin ID: 1", status: "Active" },
            { name: "김재환", id: "Admin ID: 2", status: "Active" },
            { name: "이지환", id: "Admin ID: 3", status: "Active" },
            { name: "한지민", id: "Admin ID: 4", status: "Active" },
          ],
          branches: branchPage.content,
        };

        setData(mock);
      } catch (err) {
        console.error("📊 대시보드 데이터 로딩 실패:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (!data) return <p>로딩중...</p>;

  return (
    <div className="dashboard">
      {/* 왼쪽 차트 */}
      <div className="chart-section dashboard-card">
        <h3>대여 / 반납 비율</h3>
        <PieChartBox
          borrowed={data.borrowedRatio}
          returned={data.returnedRatio}
        />
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot blue"></span> 총 빌린 책
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span> 총 반납된 책
          </div>
        </div>
      </div>

      {/* 오른쪽 섹션 */}
      <div className="right-section">
        <div className="top-section">
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalUsers}</span>
                <span className="stat-label">총 유저 수</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalBooks}</span>{" "}
                {/* ✅ DB 값 반영 */}
                <span className="stat-label">총 책 수</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalBranches}</span>
                <span className="stat-label">지점 개수</span>
              </div>
            </div>
          </div>

          <div className="admin-card dashboard-card">
            <h4>Admins</h4>
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

        {/* 하단 */}
        <div className="bottom-section">
          <div className="list-card">
            <h4>연체자 목록</h4>
            {data.borrowers.map((b, idx) => (
              <div className="list-item" key={idx}>
                <span>👤 {b.name}</span>
                <div className="list-item-status">{b.book}</div>
              </div>
            ))}
          </div>

          <div className="list-card">
            <h4>지점 목록</h4>
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
