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
        const res = await axios.get<Rental[]>("http://localhost:8080/rental/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setRentals(res.data);
      } catch (err) {
        setErrorMsg("대여 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // ✅ 반납 처리
  const handleReturn = async (rentalId: number) => {
    if (!window.confirm("이 책을 반납하시겠습니까?")) return;
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
      alert("반납이 완료되었습니다.");
      // 반납 상태 갱신
      setRentals((prev) =>
        prev.map((r) =>
          r.id === rentalId
            ? { ...r, status: "반납완료", returned: true, returnDate: new Date().toISOString() }
            : r
        )
      );
    } catch (e) {
      alert("반납 중 오류가 발생했습니다.");
    }
  };

  // ✅ 리뷰 작성 페이지 이동 (책 ID를 URL로 전달)
  const handleWriteReview = (bookId: number) => {
    navigate(`/review/write/${bookId}`);
  };

  return (
    <div className="rental-list-page">
      <h2 className="page-title">📚 내 대여 목록</h2>

      {loading && <div style={{ padding: 16 }}>불러오는 중...</div>}
      {errorMsg && <div style={{ padding: 16, color: "crimson" }}>{errorMsg}</div>}

      <table className="rental-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>도서명</th>
            <th>지점</th>
            <th>대여일</th>
            <th>반납기한</th>
            <th>반납일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {rentals.length === 0 && !loading ? (
            <tr>
              <td colSpan={8}>대여 내역이 없습니다.</td>
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
                    color: r.status === "반납완료" ? "green" : "orange",
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
                      반납하기
                    </button>
                  ) : (
                    <div className="rental-btn-group">
                      <button className="return-btn done" disabled>
                        반납완료
                      </button>
                      <button
                        className="review-btn"
                        onClick={() => handleWriteReview(r.bookId)}
                      >
                        ✏ 리뷰작성
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
