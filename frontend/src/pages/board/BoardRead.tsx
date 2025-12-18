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
import { formatDateJP } from "../../types/Date";

const BoardRead: React.FC = () => {
  const { id } = useParams();
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const typeParam = params.get("type") === "notice" ? "notice" : "general";

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        await incrementViewCount(Number(id));
        const res = await getBoard(Number(id));

        if (res.data.deleted) {
          alert("この投稿は削除されました。");
          navigate(`/board?type=${typeParam}`);
          return;
        }

        setBoard(res.data);

        const me = await getMe();
        setCurrentUser(me);
      } catch (err) {
        alert("投稿読み込み失敗");
      }
    };

    fetchBoard();
  }, [id, navigate, typeParam]);

  if (!board) return <div className="board-container">読み込み中...</div>;

  const canEditOrDelete =
    currentUser &&
    (currentUser.username === board.username ||
      currentUser.role === "MANAGER" ||
      currentUser.role === "ADMIN");

  const handleDelete = async () => {
    if (!window.confirm("削除しますか？")) return;

    await deleteBoard(board.id);
    alert("削除しました。");
    navigate(`/board?type=${typeParam}&refresh=1`);
  };

  return (
    <div className="board-container board-read">
      <h1 className="board-title">{board.title}</h1>

      <div className="board-meta">
        <div className="board-meta-row">
          <span>
            投稿者: {board.username} | [{board.type}]
          </span>
          <span>作成日: {formatDateJP(board.createdAt)}</span>
        </div>
        <div className="board-meta-row">
          <span>閲覧数: {board.viewCount}</span>
          <span>最終修正日: {formatDateJP(board.modifiedAt)}</span>
        </div>
      </div>

      <div className="board-read-card">
        <div className="board-content">{board.content}</div>

        <div className="board-read-actions">
          <button
            className="board-button"
            onClick={() => navigate(`/board?type=${typeParam}`)}
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
    </div>
  );
};

export default BoardRead;
