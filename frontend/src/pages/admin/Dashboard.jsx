import { useEffect, useState } from "react";
import "./Dashboard.css";
import PieChartBox from "../../components/chart/PieChartBox";
import StatCard from "../../components/card/StatCard";
import BorrowerList from "../../components/list/BorrowerList";
import AdminList from "../../components/list/AdminList";
import BranchList from "../../components/list/BranchList";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ✅ 임시 데이터 (mock)
    const mock = {
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
      ],
    };
    setData(mock);
  }, []);

  if (!data) return <p>로딩중...</p>;

  return (
    <div className="dashboard">
      {/* 왼쪽: 원형 차트 + 범례 */}
      <div className="dashboard-left">
        <PieChartBox
          borrowed={data.borrowedRatio}
          returned={data.returnedRatio}
        />
        <div className="legend">
          <div className="legend-item">
            <span className="dot dot-blue"></span> 총 빌린 책
          </div>
          <div className="legend-item">
            <span className="dot dot-gray"></span> 총 반납된 책
          </div>
        </div>
      </div>

      {/* 중앙: 통계 카드 + Admin/Branch 리스트 */}
      <div className="dashboard-center">
        <div className="stats">
          <StatCard label="총 유저 수" value={data.totalUsers} />
          <StatCard label="총 책 수" value={data.totalBooks} />
          <StatCard label="지점 개수" value={data.totalBranches} />
        </div>

        <div className="bottom-lists">
          <AdminList admins={data.admins} />
          <BranchList branches={data.branches} />
        </div>
      </div>

      {/* 오른쪽: 연체자 목록 */}
      <div className="dashboard-right">
        <BorrowerList borrowers={data.borrowers} />
      </div>
    </div>
  );
}
