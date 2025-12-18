import React, { useEffect, useState } from "react";
import "./RentalList.css";
import { useNavigate } from "react-router-dom";
import { getMyRentals, RentalResponse } from "../../api/RentalApi";
import { getMyReviews, Review } from "../../api/ReviewApi";

const RentalList: React.FC = () => {
  const [rentals, setRentals] = useState<RentalResponse[]>([]);
  const [reviewMap, setReviewMap] = useState<Map<number, number>>(new Map());
  // ⭐ bookId -> reviewId

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // 1️⃣ 대여 목록
      const rentalData = await getMyRentals();
      setRentals(rentalData);

      // 2️⃣ 내가 쓴 리뷰 목록
      const myReviews: Review[] = await getMyReviews();

      // 3️⃣ bookId -> reviewId 매핑
      const map = new Map<number, number>();
      myReviews.forEach((r) => {
        map.set(r.bookId, r.id);
      });

      setReviewMap(map);
    };

    fetchData();
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
          {(() => {
            const renderedBookIds = new Set<number>(); // ⭐ 이미 버튼 출력한 책

            return rentals.map((r) => {
              const reviewId = reviewMap.get(r.bookId);
              const alreadyReviewed = reviewId !== undefined;

              // ❌ 이미 이 bookId에 대해 버튼을 그렸다면 숨김
              if (renderedBookIds.has(r.bookId)) {
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.bookTitle}</td>
                    <td>{r.status}</td>
                    <td /> {/* 버튼 없음 */}
                  </tr>
                );
              }

              // ✅ 이 row에서 버튼을 그리기로 결정
              if (r.returned) {
                renderedBookIds.add(r.bookId);
              }

              return (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.bookTitle}</td>
                  <td>{r.status}</td>
                  <td>
                    {r.returned &&
                      (alreadyReviewed ? (
                        <button
                          className="review-btn edit"
                          onClick={() =>
                            navigate(`/review/edit/${reviewId}`)
                          }
                        >
                          ✏ 修整
                        </button>
                      ) : (
                        <button
                          className="review-btn"
                          onClick={() =>
                            navigate(`/review/write/${r.bookId}`)
                          }
                        >
                          ✏ レビュー
                        </button>
                      ))}
                  </td>
                </tr>
              );
            });
          })()}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
