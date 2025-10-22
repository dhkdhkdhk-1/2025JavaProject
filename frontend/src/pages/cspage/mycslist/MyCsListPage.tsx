// src/pages/cspage/mycslist/MyCsListPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../board/board.css"; // 기존 디자인 CSS 사용

interface CsResponse {
  id: number;
  userId: number;
  username: string;
  branchName: string;
  title: string;
  content: string;
  answerContent?: string;
  status: string;
  csCategory: string;
  createdAt: string;
}

const MyCsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [csList] = useState<CsResponse[]>([]);

  // ✅ 더미 데이터
 



  return (
    <div className="board-container">
      <h1 className="board-title">📨 내 문의 내역</h1>

      {csList.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999" }}>
          등록한 문의가 없습니다.
        </p>
      ) : (
        <>
          <table className="board-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>지점</th>
                <th>상태</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {csList.map((c, index) => (
              <tr key={c.id} style={{ cursor: "pointer" }}
                onClick={() => navigate(`/cs/detail/${c.id}`)}>
                  <td>{csList.length - index}</td>
                  <td style={{ textAlign: "left" }}>{c.title}</td>
                  <td>{c.branchName}</td>
                  <td
                    style={{
                      color:
                        c.status === "WAITING"
                          ? "orange"
                          : c.status === "ANSWERING"
                          ? "blue"
                          : "green",
                      fontWeight: 600,
                    }}
                  >
                    {c.status}
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 테이블 전체 아래, 오른쪽 정렬 */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button className="board-button" onClick={() => navigate("/writecs")}>
              ✏️ 문의글 작성
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyCsListPage;
