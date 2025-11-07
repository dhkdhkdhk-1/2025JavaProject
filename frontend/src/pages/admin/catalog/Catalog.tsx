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

  // ✅ データ取得
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await getAllRentals(); // /rental/list リクエスト
        setRentals(res);
      } catch (err) {
        console.error("📦 貸出リストの取得に失敗しました:", err);
      }
    };
    fetchRentals();
  }, []);

  // ✅ 延滞データ（現在はフィルターで区別）
  const filtered = rentals.filter((r) => {
    if (tab === "borrowed") return true;
    if (tab === "overdue")
      return !r.returned && new Date(r.dueDate) < new Date();
    return true;
  });

  // ✅ 検索機能
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
          {/* ✅ タブボタン */}
          <div className="tab-buttons">
            <button
              className={tab === "borrowed" ? "active" : ""}
              onClick={() => setTab("borrowed")}
            >
              貸出中の本
            </button>
            <button
              className={tab === "overdue" ? "active" : ""}
              onClick={() => setTab("overdue")}
            >
              延滞中の本
            </button>
          </div>

          {/* ✅ 検索ボックス */}
          <div className="catalog-search">
            <input
              type="text"
              placeholder="ID / タイトル / 支店 で検索"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ✅ テーブル */}
          <table className="catalog-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>書籍名</th>
                <th>支店</th>
                <th>貸出日</th>
                <th>返却予定日</th>
                <th>{tab === "borrowed" && "返却日"}</th>
                <th>状態</th>
                <th>{tab === "overdue" && "メール送信"}</th>
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
                      {r.returned ? "返却完了" : "貸出中"}
                    </td>
                    <td>
                      {tab === "overdue" && (
                        <button
                          className="mail-btn"
                          onClick={() => sendReturnMail(r.id)}
                        >
                          📧 送信
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>データがありません。</td>
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
