import React from "react";
import { BoardResponse } from "../../../api/BoardApi";
import "../board.css";

interface Props {
  boards: BoardResponse[];
  onSelect: (id: number) => void;
}

const BoardTable: React.FC<Props> = ({ boards, onSelect }) => {
  if (!boards || boards.length === 0)
    return (
      <p style={{ textAlign: "center", color: "#777" }}>投稿がありません.</p>
    );

  return (
    <table className="board-table">
      <thead>
        <tr>
          <th>番号</th>
          <th>分類</th>
          <th>タイトル</th>
          <th>投稿者</th>
          <th>閲覧数</th>
        </tr>
      </thead>
      <tbody>
        {boards.map((board) => (
          <tr
            key={board.id}
            onClick={() => onSelect(board.id)}
            className="board-row"
          >
            <td>{board.displayId ?? board.id}</td>
            <td>{board.type}</td>
            <td>{board.title}</td>
            <td>{board.username}</td>
            <td>{board.viewCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BoardTable;
