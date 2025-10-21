import React, { useEffect, useState } from "react";
import {
  getAllRentals,
  RentalResponse,
  sendReturnMail,
} from "../../../api/RentalApi";
import "./Catalog.css";

const Catalog: React.FC = () => {
  const [tab, setTab] = useState<"borrowed" | "overdue">("borrowed");
  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const [search, setSearch] = useState("");

  // ✅ 데이터 가져오기
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await getAllRentals(); // /rental/list 요청
        setRentals(res);
      } catch (err) {
        console.error("📦 대여 목록 조회 실패:", err);
      }
    };
    fetchRentals();
  }, []);

  // ✅ 연체 데이터 (지금은 필터로 분리)
  const filtered = rentals.filter((r) => {
    if (tab === "borrowed") return true;
    if (tab === "overdue")
      return !r.returned && new Date(r.dueDate) < new Date();
    return true;
  });

  // ✅ 검색 기능
  const searched = filtered.filter(
    (r) =>
      r.id.toString().includes(search.trim()) ||
      r.bookTitle.toLowerCase().includes(search.trim().toLowerCase()) ||
      r.branchName.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="admin-layout">
      <div className="admin-body">
        <div className="catalog-container">
          {/* ✅ 탭 버튼 */}
          <div className="tab-buttons">
            <button
              className={tab === "borrowed" ? "active" : ""}
              onClick={() => setTab("borrowed")}
            >
              빌린 책 현황
            </button>
            <button
              className={tab === "overdue" ? "active" : ""}
              onClick={() => setTab("overdue")}
            >
              연체 현황
            </button>
          </div>

          {/* ✅ 검색창 */}
          <div className="catalog-search">
            <input
              type="text"
              placeholder="Search by ID / Title / Branch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ✅ 테이블 */}
          <table className="catalog-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>도서명</th>
                <th>지점</th>
                <th>대여일</th>
                <th>반납예정일</th>
                <th>{tab === "borrowed" && "반납일"}</th>
                <th>상태</th>
                <th>{tab === "overdue" && "메일 발송"}</th>
              </tr>
            </thead>
            <tbody>
              {searched.length > 0 ? (
                searched.map((r) => (
                  <tr key={r.id}>
                    <td>{String(r.id).padStart(3, "0")}</td>
                    <td>{r.bookTitle}</td>
                    <td>{r.branchName}</td>
                    <td>{r.rentalDate}</td>
                    <td>{r.dueDate}</td>
                    <td>
                      {r.returnDate
                        ? r.returnDate
                        : tab === "borrowed"
                        ? "-"
                        : ""}
                    </td>
                    <td style={{ color: r.returned ? "#2ecc71" : "#e74c3c" }}>
                      {r.returned ? "반납 완료" : "대여 중"}
                    </td>
                    <td>
                      {tab === "overdue" && (
                        <button
                          className="mail-btn"
                          onClick={() => sendReturnMail(r.id)}
                        >
                          📧 보내기
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
