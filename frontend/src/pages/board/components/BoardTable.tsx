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
      <p style={{ textAlign: "center", color: "#777" }}>게시글이 없습니다.</p>
    );

  return (
    <table className="board-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>분류</th>
          <th>제목</th>
          <th>작성자</th>
          <th>조회수</th>
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
