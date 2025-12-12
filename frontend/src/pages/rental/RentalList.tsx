// src/pages/mypage/RentalList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RentalList.css";
import { useNavigate } from "react-router-dom";

interface Rental {
  id: number;
  bookId: number;
  bookTitle: string;
  branchName: string;
  username: string;
  rentalDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: string;
  returned: boolean;
}

const RentalList: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();

  // ✅ 대여 목록 가져오기
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const res = await axios.get<Rental[]>(
          "http://localhost:8080/rental/my",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setRentals(res.data);
      } catch (err) {
        setErrorMsg("レンタルリストを取得できませんでした。");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // ✅ 반납 처리
  const handleReturn = async (rentalId: number) => {
    if (!window.confirm("この本を返却しますか？")) return;
    try {
      await axios.put(
        "http://localhost:8080/rental/return",
        { rentalId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      alert("返却が完了しました。");
      // 반납 상태 갱신
      setRentals((prev) =>
        prev.map((r) =>
          r.id === rentalId
            ? {
                ...r,
                status: "返却済み",
                returned: true,
                returnDate: new Date().toISOString(),
              }
            : r
        )
      );
    } catch (e) {
      alert("返却中にエラーが発生しました。");
    }
  };

  // ✅ 리뷰 작성 페이지 이동 (책 ID를 URL로 전달)
  const handleWriteReview = (bookId: number) => {
    navigate(`/review/write/${bookId}`);
  };

  return (
    <div className="rental-list-page">
      <h2 className="page-title">📚 マイレンタルリスト</h2>

      {loading && <div style={{ padding: 16 }}>読み込み中...</div>}
      {errorMsg && (
        <div style={{ padding: 16, color: "crimson" }}>{errorMsg}</div>
      )}

      <table className="rental-table">
        <thead>
          <tr>
            <th>番号</th>
            <th>書籍名</th>
            <th>支店</th>
            <th>レンタル日</th>
            <th>返却期限</th>
            <th>返却日</th>
            <th>状態</th>
            <th>管理</th>
          </tr>
        </thead>
        <tbody>
          {rentals.length === 0 && !loading ? (
            <tr>
              <td colSpan={8}>レンタル履歴はありません。</td>
            </tr>
          ) : (
            rentals.map((r, idx) => (
              <tr key={r.id}>
                <td>{idx + 1}</td>
                <td>{r.bookTitle}</td>
                <td>{r.branchName}</td>
                <td>{new Date(r.rentalDate).toLocaleDateString()}</td>
                <td>{new Date(r.dueDate).toLocaleDateString()}</td>
                <td>
                  {r.returnDate
                    ? new Date(r.returnDate).toLocaleDateString()
                    : "-"}
                </td>
                <td
                  style={{
                    color: r.status === "返却済み" ? "green" : "orange",
                    fontWeight: 600,
                  }}
                >
                  {r.status}
                </td>
                <td>
                  {!r.returned ? (
                    <button
                      className="return-btn"
                      onClick={() => handleReturn(r.id)}
                    >
                      返却する
                    </button>
                  ) : (
                    <div className="rental-btn-group">
                      <button className="return-btn done" disabled>
                        返却済み
                      </button>
                      <button
                        className="review-btn"
                        onClick={() => handleWriteReview(r.bookId)}
                      >
                        ✏ レビュー作成
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
