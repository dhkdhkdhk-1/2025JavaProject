import React, { useEffect, useState } from "react";
import "./RentalList.css";
import { useNavigate } from "react-router-dom";
import { getMyRentals, RentalResponse } from "../../api/RentalApi";

const RentalList: React.FC = () => {
  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyRentals().then(setRentals);
  }, []);

  return (
    <div className="rental-list-page">
      <h2>📚 マイレンタル</h2>

      <table className="rental-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>書籍</th>
            <th>状態</th>
            <th>管理</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.bookTitle}</td>
              <td>{r.status}</td>
              <td>
                {r.returned && (
                  <button
                    className="review-btn"
                    onClick={() => navigate(`/review/write/${r.bookId}`)}
                  >
                    ✏ レビュー
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
