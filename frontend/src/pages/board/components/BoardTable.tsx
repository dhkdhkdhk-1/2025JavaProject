// components/BoardTable.tsx
import React from "react";
import { BoardResponse } from "../../../api/BoardApi";
import "../board.css";

interface Props {
  boards: BoardResponse[];
  onSelect: (id: number) => void;
}

const BoardTable: React.FC<Props> = ({ boards, onSelect }) => {
  if (!boards || boards.length === 0) {
    return <p>投稿がありません。</p>;
  }

  return (
    <table className="board-table">
      <thead>
        <tr>
          <th className="col-no">番号</th>
          <th className="col-type">分類</th>
          <th className="col-title">タイトル</th>
          <th className="col-user">投稿者</th>
          <th className="col-view">閲覧数</th>
        </tr>
      </thead>

      <tbody>
        {boards.map((board) => (
          <tr key={board.id} onClick={() => onSelect(board.id)}>
            <td className="col-no">{board.displayId ?? board.id}</td>
            <td className="col-type">{board.type}</td>
            <td className="col-title" title={board.title}>
              {board.title}
            </td>
            <td className="col-user">{board.username}</td>
            <td className="col-view">{board.viewCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BoardTable;
