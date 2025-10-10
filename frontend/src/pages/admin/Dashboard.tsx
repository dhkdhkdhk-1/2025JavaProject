import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import PieChartBox from "../../components/chart/PieChartBox";
import StatCard from "../../components/card/StatCard";
import BorrowerList from "../../components/list/BorrowerList";
import AdminList from "../../components/list/AdminList";
import BranchList from "../../components/list/BranchList";

export interface DashboardData {
  totalUsers: number;
  totalBooks: number;
  totalBranches: number;
  borrowedRatio: number;
  returnedRatio: number;
  borrowers: { name: string; book: string }[];
  admins: { name: string; id: string; status: string }[];
  branches: { name: string; id: string }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const mock: DashboardData = {
      totalUsers: 150,
      totalBooks: 1500,
      totalBranches: 10,
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
      ],
      branches: [
        { name: "영남이공대학교 도서관", id: "Branch ID: 1" },
        { name: "BookWorm - Main", id: "Branch ID: 2" },
        { name: "BookWorm - Matzra", id: "Branch ID: 3" },
        { name: "BookWorm - Downtown", id: "Branch ID: 4" },
        { name: "BookWorm - Campus", id: "Branch ID: 5" },
        { name: "BookWorm - West", id: "Branch ID: 6" },
      ],
    };
    setData(mock);
  }, []);

  if (!data) return <p>로딩중...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <StatCard label="총 유저 수" value={data.totalUsers} />
        <StatCard label="총 책 수" value={data.totalBooks} />
        <StatCard label="지점 개수" value={data.totalBranches} />
      </div>

      <div className="dashboard-content">
        {/* 왼쪽 차트 */}
        <div className="dashboard-left">
          <div className="chart-card">
            <h3>대여/반납 비율</h3>
            <PieChartBox
              borrowed={data.borrowedRatio}
              returned={data.returnedRatio}
            />
          </div>
        </div>

        {/* 중앙: 관리자 + 지점 */}
        <div className="dashboard-center">
          <AdminList admins={data.admins} />
          <BranchList branches={data.branches} />
        </div>

        {/* 오른쪽: 연체자 */}
        <div className="dashboard-right">
          <BorrowerList borrowers={data.borrowers} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
