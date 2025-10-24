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
    (params.get("type") as "一般" | "告知") || ("一般" as "一般" | "告知");

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        await incrementViewCount(Number(id));
        const res = await getBoard(Number(id));

        if (res.data.deleted) {
          alert("この投稿はすでに削除されました。");
          navigate(`/board?type=${typeParam}`);
          return;
        }

        setBoard(res.data);

        const me = await getMe();
        setCurrentUser(me);
      } catch (err) {
        console.error("投稿読み込みに失敗しました。:", err);
        alert("投稿の読み込み中エラーが発生しました。");
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
    const confirmed = window.confirm("本当にこの投稿を削除しますか？");
    if (!confirmed) return;

    try {
      await deleteBoard(board.id);
      alert("投稿を削除しました。");
      navigate(`/board?type=${typeParam}&refresh=1`);
    } catch (err) {
      console.error("削除失敗:", err);
      alert("削除の途中エラーが発生しました。");
    }
  };

  if (!board) return <div className="board-container">投稿読み込み中...</div>;

  return (
    <div className="board-container">
      <h1 className="board-title">{board.title}</h1>

      <div className="board-meta">
        <div className="board-meta-row">
          <span className="board-meta-left">
            投稿者: {board.username} &nbsp; | &nbsp; [{board.type}]
          </span>
          <span className="board-meta-right">
            作成日: {new Date(board.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="board-meta-row">
          <span className="board-meta-left">閲覧数: {board.viewCount}</span>
          <span className="board-meta-right">
            最終修正日: {new Date(board.modifiedAt).toLocaleString()}
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
          リスト
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
              修正
            </button>
            <button className="board-button delete" onClick={handleDelete}>
              削除
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BoardRead;
