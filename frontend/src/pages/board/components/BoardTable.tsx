import React from "react";
import "../board.css";

interface Props {
  boards: {
    id: number;
    title: string;
    type: string;
    username: string;
    viewCount: number;
  }[];
  onSelect: (id: number) => void;
}

const BoardTable: React.FC<Props> = ({ boards, onSelect }) => {
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
        {boards.map((b) => (
          <tr key={b.id} onClick={() => onSelect(b.id)}>
            <td>{b.id}</td>
            <td>{b.type}</td>
            <td style={{ textAlign: "left" }}>{b.title}</td>
            <td>{b.username}</td>
            <td>{b.viewCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BoardTable;
