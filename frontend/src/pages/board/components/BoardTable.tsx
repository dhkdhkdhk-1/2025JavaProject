import React from "react";
import "../board.css";

interface Props {
  boards: {
    id: number;
    displayId?: number; // ✅ 화면용 번호
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
        {boards.length > 0 ? (
          boards.map((b) => (
            <tr key={b.id} onClick={() => onSelect(b.id)}>
              <td>{b.displayId ?? b.id}</td>
              <td>{b.type}</td>
              <td style={{ textAlign: "left" }}>{b.title}</td>
              <td>{b.username}</td>
              <td>{b.viewCount}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
              게시글이 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default BoardTable;
