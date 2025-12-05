import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // ⭐ 추가됨
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

  const location = useLocation(); // ⭐ URL 읽기용 추가
  const params = new URLSearchParams(location.search);
  const typeParam = params.get("type") || "一般"; // ⭐ URL 의 type 값 사용

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
        console.error("投稿読み込み失敗:", err);
        alert("投稿を読み込めませんでした。");
      }
    };

    fetchBoard();
  }, [id, navigate, typeParam]);

  if (!board) return <div className="board-container">投稿読み込み中...</div>;

  /** ✔ URL 기준으로 공지/일반 결정 */
  const listType = typeParam === "告知" ? "告知" : "一般";

  /** 수정/삭제 권한 */
  const canEditOrDelete =
    currentUser &&
    (currentUser.username === board.username ||
      currentUser.role === "MANAGER" ||
      currentUser.role === "ADMIN");

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      await deleteBoard(board.id);
      alert("削除しました。");

      navigate(`/board?type=${listType}&refresh=1`);
    } catch (err) {
      console.error("削除失敗:", err);
      alert("削除中にエラーが発生しました。");
    }
  };

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
        {/* ✔ 리스트로 이동할 때 URL 의 type 유지 */}
        <button
          className="board-button"
          onClick={() => navigate(`/board?type=${listType}`)}
          style={{ marginRight: "10px" }}
        >
          リスト
        </button>

        {canEditOrDelete && (
          <>
            <button
              className="board-button"
              onClick={() =>
                navigate(`/board/edit/${board.id}?type=${listType}`)
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
