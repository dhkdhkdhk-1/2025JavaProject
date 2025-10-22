// src/pages/cspage/admincs/AdminCsManager.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../board/board.css";

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

const AdminCsManager: React.FC = () => {
  const navigate = useNavigate();

  // ✅ 더미 데이터
  const dummyData: CsResponse[] = [
    {
      id: 1,
      userId: 101,
      username: "홍길동",
      branchName: "서울지점",
      title: "도서 반납이 안돼요",
      content: "도서를 반납했는데 시스템에 반영이 안됐어요.",
      answerContent: "확인 후 반영 완료했습니다.",
      status: "COMPLETED",
      csCategory: "도서관련",
      createdAt: "2025-10-20T14:30:00",
    },
    {
      id: 2,
      userId: 101,
      username: "홍길동",
      branchName: "부산지점",
      title: "로그인이 안돼요",
      content: "비밀번호를 바꿨는데 접속이 안돼요.",
      status: "WAITING",
      csCategory: "계정관련",
      createdAt: "2025-10-19T09:00:00",
    },
    {
      id: 3,
      userId: 101,
      username: "홍길동",
      branchName: "대구지점",
      title: "홈페이지 오류",
      content: "문의 작성 버튼이 안 눌러집니다.",
      answerContent: "버그 수정 중입니다.",
      status: "ANSWERING",
      csCategory: "기타",
      createdAt: "2025-10-18T11:45:00",
    },
  ];

  const [csList] = useState<CsResponse[]>(dummyData);

  return (
    <div className="admin-layout">
      <div className="admin-body">
        <main className="admin-content">
          <div className="book-header">
            <h2>📨 문의 관리</h2>
          </div>

          <table className="book-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>작성자</th>
                <th>지점</th>
                <th>상태</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {csList.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.username}</td>
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
                  <td>
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                      navigate(`/admin/answerwrite/${c.id}`)
                      }
                    >
                      🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default AdminCsManager;
