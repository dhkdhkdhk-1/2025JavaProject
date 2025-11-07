import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMe, User } from "../../../api/AuthApi"; // 로그인한 유저 정보 가져오는 API
import "./MyCsListDetail.css";

interface CsDetail {
  id: number;
  username: string;
  branchName: string;
  title: string;
  content: string;
  answerContent?: string;
  status: string;
  csCategory: string;
  createdAt: string;
}

const MyCsListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CsDetail | null>(null);
  const [user, setUser] = useState<User | null>(null); // 유저 정보
  const [loading, setLoading] = useState(true);

  // ✅ 더미데이터 목록
  const dummyData: CsDetail[] = [
    {
      id: 1,
      username: "홍길동",
      branchName: "서울지점",
      title: "도서 반납이 안돼요",
      content: "도서를 반납했는데 시스템에 반영이 안됐어요.",
      answerContent: "확인 후 반영 완료했습니다. 이용해 주셔서 감사합니다 😊",
      status: "COMPLETED",
      csCategory: "도서관련",
      createdAt: "2025-10-20T14:30:00",
    },
    {
      id: 2,
      username: "홍길동",
      branchName: "부산지점",
      title: "로그인이 안돼요",
      content: "비밀번호를 바꿨는데 접속이 안돼요.",
      answerContent: "",
      status: "WAITING",
      csCategory: "계정관련",
      createdAt: "2025-10-19T09:00:00",
    },
    {
      id: 3,
      username: "홍길동",
      branchName: "대구지점",
      title: "홈페이지 오류",
      content: "문의 작성 버튼이 안 눌러집니다.",
      answerContent: "현재 개발팀이 수정 중입니다.",
      status: "ANSWERING",
      csCategory: "기타",
      createdAt: "2025-10-18T11:45:00",
    },
  ];

  // ✅ 페이지 진입 시 로그인 상태 및 유저 정보 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login", { replace: true });
      return;
    }

    // 유저 정보 가져오기
    getMe()
      .then((userData) => {
        setUser(userData); // 로그인된 유저 정보 저장
        // 더미 데이터에서 해당 ID의 내역을 찾기
        const found = dummyData.find((item) => item.id === Number(id));
        setCs(found || null); // 해당 ID의 내역을 찾으면 설정
        setLoading(false);
      })
      .catch((error) => {
        console.error("유저 정보를 가져오는 데 실패:", error);
        navigate("/login", { replace: true }); // 로그인 페이지로 이동
      });
  }, [id, navigate]);

  if (loading) return <div className="board-container">불러오는 중...</div>;
  if (!cs) return <div className="board-container">문의 내역을 찾을 수 없습니다.</div>;

  return (
    <div className="board-container">
      <h1 className="board-title">{cs.title}</h1>

      <div className="board-meta">
        <div className="board-meta-row">
          <span className="board-meta-left">
            작성자: {cs.username} &nbsp; | &nbsp; {cs.branchName} | {cs.csCategory}
          </span>
          <span className="board-meta-right">
            작성일: {new Date(cs.createdAt).toLocaleString()}
          </span>
        </div>
        <div className="board-meta-row">
          <span className="board-meta-left">
            상태:{" "}
            <span
              style={{
                color:
                  cs.status === "WAITING"
                    ? "orange"
                    : cs.status === "ANSWERING"
                    ? "blue"
                    : "green",
                fontWeight: 600,
              }}
            >
              {cs.status}
            </span>
          </span>
        </div>
      </div>

      <div className="board-content">
        <h3>📩 문의 내용</h3>
        <p>{cs.content}</p>
      </div>

      {cs.answerContent ? (
        <div className="board-answer">
          <h3>💬 관리자 답변</h3>
          <p>{cs.answerContent}</p>
        </div>
      ) : (
        <div className="board-answer waiting">
          <h3>⌛ 답변 대기 중</h3>
          <p>현재 담당자가 확인 중입니다.</p>
        </div>
      )}

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate("/cs")}
          style={{ marginRight: "10px" }}
        >
          목록으로
        </button>
      </div>
    </div>
  );
};

export default MyCsListDetail;
