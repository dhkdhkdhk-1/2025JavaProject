import React, { useEffect, useState } from "react";
import PieChartBox from "../../../components/chart/PieChartBox";
import { getBooks, Book } from "../../../api/BookApi";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
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
        // ✅ 모든 데이터 병렬 요청
        const [bookPage, adminPage, branchPage, rentals, userPage] =
          await Promise.all([
            getBooks(0, 5),
            getAdmins(0, 5),
            getBranches(0, 5),
            getAllRentals(),
            getUsers(0, 5),
          ]);
        console.log("📦 User data:", userPage.content);

        // ✅ 관리자 / 매니저 필터링
        const admins = adminPage.content.map((a: User) => ({
          name: a.username,
          id: `${a.role}: ${a.id}`,
          status: "Active",
        }));

        // ✅ 대여 / 반납 갯수 계산
        const borrowedCount = rentals.filter((r) => !r.returned).length;
        const returnedCount = rentals.filter((r) => r.returned).length;

        // ✅ 통합 데이터 구성
        setData({
          totalUsers: userPage.totalElements,
          totalBooks: bookPage.totalElements,
          totalBranches: branchPage.totalElements,
          borrowedCount,
          returnedCount,
          admins,
          books: bookPage.content,
          branches: branchPage.content,
        });
      } catch (err) {
        console.error("📊 대시보드 데이터 로딩 실패:", err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>로딩중...</p>;

  return (
    <div className="dashboard">
      {/* ===== 왼쪽: 대여 / 반납 ===== */}
      <div className="chart-section dashboard-card">
        <h3>📊 대여 / 반납 현황</h3>
        <PieChartBox
          borrowed={data.borrowedCount}
          returned={data.returnedCount}
        />
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot blue"></span> 대여 중:{" "}
            {data.borrowedCount}권
          </div>
          <div className="legend-item">
            <span className="legend-dot gray"></span> 반납 완료:{" "}
            {data.returnedCount}권
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
                <span className="stat-label">총 유저 수</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <span className="stat-value">{data.totalBooks}</span>
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
            {data.admins.length > 0 ? (
              data.admins.map((a, idx) => (
                <div className="list-item" key={idx}>
                  <div className="list-item-name">
                    <span>👨‍💻 {a.name}</span>
                    <small>{a.id}</small>
                  </div>
                  <div className="list-item-status">{a.status}</div>
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
            <h4>책 목록</h4>
            {data.books.map((b, idx) => (
              <div className="list-item" key={idx}>
                <span>📖 {b.title}</span>
                <div className="list-item-status">ID: {b.id}</div>
              </div>
            ))}
          </div>

          {/* 지점 목록 */}
          <div className="list-card">
            <h4>지점 목록</h4>
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
