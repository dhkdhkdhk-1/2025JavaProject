import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCsListPage.css";

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

  return (
    <div className="board-container">
      <h1 className="board-title">📨 お問い合わせ履歴</h1>

      {/* ✅ 테이블 전체를 감싸는 wrapper */}
      <div className="table-wrapper">
        <table className="board-table">
          <thead>
            <tr>
              <th>番号</th>
              <th>タイトル</th>
              <th>支店</th>
              <th>状態</th>
              <th>作成日</th>
            </tr>
          </thead>

          <tbody>
            {csList.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    color: "#999",
                    height: "200px",
                  }}
                >
                  登録されたお問い合わせはありません。
                </td>
              </tr>
            ) : (
              csList.map((c, index) => (
                <tr
                  key={c.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/cs/detail/${c.id}`)}
                >
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ 버튼은 테이블 아래 오른쪽 정렬 */}
      <div className="table-footer">
        <button className="board-button" onClick={() => navigate("/writecs")}>
          ✏️ お問い合わせ作成
        </button>
      </div>
    </div>
  );
};

export default MyCsListPage;
