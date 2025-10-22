import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getBoard,
  incrementViewCount,
  deleteBoard,
  BoardResponse,
} from "../../api/BoardApi";
import { getMe, User } from "../../api/AuthApi";
import "./board.css";

const BoardRead: React.FC = () => {
  const { id } = useParams();
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const typeParam =
    (params.get("type") as "일반" | "공지") || ("일반" as "일반" | "공지");

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        await incrementViewCount(Number(id));
        const res = await getBoard(Number(id));

        if (res.data.deleted) {
          alert("삭제된 게시글입니다.");
          navigate(`/board?type=${typeParam}`);
          return;
        }

        setBoard(res.data);

        const me = await getMe();
        setCurrentUser(me);
      } catch (err) {
        console.error("글 불러오기 실패:", err);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchBoard();
  }, [id, navigate, typeParam]);

  const canEditOrDelete =
    currentUser &&
    board &&
    (currentUser.username === board.username ||
      currentUser.role === "MANAGER" ||
      currentUser.role === "ADMIN");

  const handleDelete = async () => {
    if (!board) return;
    const confirmed = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteBoard(board.id);
      alert("글이 삭제되었습니다.");
      navigate(`/board?type=${typeParam}&refresh=1`);
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!board)
    return <div className="board-container">게시글을 불러오는 중...</div>;

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
            최종 수정: {new Date(board.modifiedAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="board-content">{board.content}</div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate(`/board?type=${typeParam}`)}
          style={{ marginRight: "10px" }}
        >
          목록
        </button>

        {canEditOrDelete && (
          <>
            <button
              className="board-button"
              onClick={() =>
                navigate(`/board/edit/${board.id}?type=${typeParam}`)
              }
              style={{ marginRight: "10px" }}
            >
              수정
            </button>
            <button className="board-button delete" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardRead;
