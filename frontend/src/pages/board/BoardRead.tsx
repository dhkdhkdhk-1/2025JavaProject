import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBoard,
  incrementViewCount,
  BoardResponse,
} from "../../api/BoardApi";
import "./board.css";

const BoardRead: React.FC = () => {
  const { id } = useParams();
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        // ✅ 1️⃣ 조회수 먼저 증가
        await incrementViewCount(Number(id));

        // ✅ 2️⃣ 조회수 증가 후, 글 데이터 불러오기
        const res = await getBoard(Number(id));
        setBoard(res.data);
      } catch (err) {
        console.error("글 불러오기 실패:", err);
      }
    };

    fetchBoard();
  }, [id]);

  if (!board) return <div className="board-container">불러오는 중...</div>;

  return (
    <div className="board-container">
      <h1 className="board-title">{board.title}</h1>

      <div className="board-meta">
        <div className="board-meta-row">
          <span className="board-meta-left">
            작성자: {board.username} &nbsp; | &nbsp; [{board.type}]
          </span>
          <span className="board-meta-right">
            작성일: {new Date(board.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="board-meta-row">
          <span className="board-meta-left">조회수: {board.viewCount}</span>
          <span className="board-meta-right">
            최종수정: {new Date(board.modifiedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="board-content">{board.content}</div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate("/board")}
          style={{ marginRight: "10px" }}
        >
          목록
        </button>
        <button
          className="board-button"
          onClick={() => navigate(`/board/edit/${board.id}`)}
        >
          수정
        </button>
      </div>
    </div>
  );
};

export default BoardRead;
