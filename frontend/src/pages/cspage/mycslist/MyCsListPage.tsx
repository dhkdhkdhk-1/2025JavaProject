import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
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
  const [csList, setCsList] = useState<CsResponse[]>([]);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 6;
  const PAGE_GROUP_SIZE = 9;
  const navigate = useNavigate(); // ✅ 페이지 이동 훅

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

  useEffect(() => {
    setCsList(dummyData);
  }, []);

  const totalPages = Math.ceil(csList.length / PAGE_SIZE);
  const currentGroup = Math.floor(page / PAGE_GROUP_SIZE);
  const startPage = currentGroup * PAGE_GROUP_SIZE;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages - 1);
  const getPageNumbers = () =>
    Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const startIdx = page * PAGE_SIZE;
  const displayedCs = csList.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="Cs-board-container">
      <div className="Cs-board-card">
        <h1 className="board-title">📨 내 문의 내역</h1>

        {csList.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            등록한 문의가 없습니다.
          </p>
        ) : (
          <div className="table-container">
            <div className="table-header">
              <div className="header-cell col-number">번호</div>
              <div className="header-cell col-title">제목</div>
              <div className="header-cell col-branch">지점</div>
              <div className="header-cell col-status">상태</div>
              <div className="header-cell col-date">작성일</div>
            </div>
            <div className="table-divider"></div>

            <div className="table-body">
              {displayedCs.map((c, index) => (
                <div
                  key={c.id}
                  className="table-row"
                  onClick={() => navigate(`/cs/detail/${c.id}`)} // ✅ 클릭 시 이동
                  style={{ cursor: "pointer" }}
                >
                  <div className="table-cell col-number">
                    {csList.length - (startIdx + index)}
                  </div>
                  <div className="table-cell col-title">{c.title}</div>
                  <div className="table-cell col-branch">{c.branchName}</div>
                  <div
                    className="table-cell col-status"
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
                  </div>
                  <div className="table-cell col-date">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCsListPage;
