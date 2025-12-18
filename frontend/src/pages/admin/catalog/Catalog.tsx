import React, { useEffect, useState } from "react";
import {
  getAllRentals,
  RentalResponse,
  sendReturnMail,
  returnRental,
} from "../../../api/RentalApi";
import "./Catalog.css";
import { formatDateJP } from "../../../types/Date";

const Catalog: React.FC = () => {
  // 현재 선택된 탭 상태 (대여중 / 연체)
  const [tab, setTab] = useState<"borrowed" | "overdue">("borrowed");

  // 대여 목록 데이터
  const [rentals, setRentals] = useState<RentalResponse[]>([]);

  // 검색어 상태
  const [search, setSearch] = useState("");

  // 초기 렌탈 데이터 조회
  useEffect(() => {
    getAllRentals().then(setRentals);
  }, []);

  // 탭에 따른 필터링 처리
  const filtered = rentals.filter((r) => {
    if (tab === "borrowed") return true;
    if (tab === "overdue") {
      return !r.returned && new Date(r.dueDate) < new Date();
    }
    return true;
  });

  // 검색어에 따른 필터링 처리
  const searched = filtered.filter(
    (r) =>
      r.id.toString().includes(search.trim()) ||
      r.bookTitle.toLowerCase().includes(search.trim().toLowerCase()) ||
      r.branchName.toLowerCase().includes(search.trim().toLowerCase())
  );

  // 반납 처리 버튼 클릭 시 동작
  const handleReturn = async (id: number) => {
    if (!window.confirm("この本を返却処理しますか？")) return;

    await returnRental(id);

    // UI 즉시 반영
    setRentals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              returned: true,
              status: "返却済み",
              returnDate: new Date().toISOString(),
            }
          : r
      )
    );
  };

  return (
    <div className="admin-layout">
      {/* 사이드바 및 상단 헤더로 인한 여백 확보용 컨테이너 */}
      <div className="admin-body catalog-page">
        <div className="catalog-container">
          {/* 탭 버튼 영역 */}
          <div className="tab-buttons">
            <button
              className={tab === "borrowed" ? "active" : ""}
              onClick={() => setTab("borrowed")}
            >
              貸出中
            </button>
            <button
              className={tab === "overdue" ? "active" : ""}
              onClick={() => setTab("overdue")}
            >
              延滞
            </button>
          </div>

          {/* 검색 입력 영역 */}
          <div className="catalog-search">
            <input
              type="text"
              placeholder="ID / 書籍 / 支店"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 대여 목록 테이블 */}
          <table className="catalog-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>書籍</th>
                <th>支店</th>
                <th>貸出日</th>
                <th>返却予定日</th>
                <th>返却日</th>
                <th>状態</th>
                <th>管理</th>
              </tr>
            </thead>

            <tbody>
              {searched.length > 0 ? (
                searched.map((r) => (
                  <tr key={r.id}>
                    {/* ID 컬럼 (왼쪽 여백 확보용 클래스 적용) */}
                    <td className="col-id">
                      {String(r.id).padStart(3, "0")}
                    </td>

                    <td>{r.bookTitle}</td>
                    <td>{r.branchName}</td>
                    <td>{formatDateJP(r.rentalDate)}</td>
                    <td>{formatDateJP(r.dueDate)}</td>
                    <td>{r.returnDate
                        ? new Date(r.returnDate).toLocaleString("ja-JP")
                        : "-"}
                    </td>

                    <td
                      style={{
                        fontWeight: 600,
                        color: r.returned ? "#2ecc71" : "#e67e22",
                      }}
                    >
                      {r.status}
                    </td>

                    <td>
                      <div className="action-buttons">
                        {/* 반납 처리 버튼 */}
                        {!r.returned && (
                          <button
                            className="approve-btn"
                            onClick={() => handleReturn(r.id)}
                          >
                            ✔ 返却処理
                          </button>
                        )}

                        {/* 연체 상태일 경우 메일 발송 버튼 */}
                        {tab === "overdue" && !r.returned && (
                          <button
                            className="mail-btn"
                            onClick={() => sendReturnMail(r.id)}
                          >
                            📧 通知
                          </button>
                        )}

                        {/* 반납 완료 표시 */}
                        {r.returned && (
                          <span className="done-text">完了</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // 데이터가 없을 경우 표시
                <tr className="empty-row">
                  <td colSpan={8}>データがありません。</td>
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
