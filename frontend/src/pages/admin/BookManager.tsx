import React, { useEffect, useState } from "react";
import { getBooks, Book } from "../../api/BookApi";
import Sidebar from "../../components/sidebar/Sidebar";
import "./BookManager.css";

const BookManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getBooks(page, 10, keyword).then((data) => {
      setBooks(data.content);
      setTotalPages(data.totalPages);
    });
  }, [page, keyword]);

  const translateCategory = (c: string) => {
    switch (c) {
      case "NOVEL":
        return "소설";
      case "ESSAY":
        return "에세이";
      case "IT":
        return "IT / 프로그래밍";
      case "HISTORY":
        return "역사";
      case "SCIENCE":
        return "과학";
      default:
        return "기타";
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <div className="book-header">
            <h2>📘 도서 관리</h2>
            <div className="book-actions">
              <button className="add-btn">+ Add Book</button>
              <input
                type="text"
                placeholder="Search by title..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <table className="book-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>저자</th>
                <th>출판사</th>
                <th>카테고리</th>
                <th>대여 가능 여부</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{translateCategory(b.category)}</td>
                  <td>{b.available ? "가능" : "불가"}</td>
                  <td>
                    <button className="icon-btn edit">✏️</button>
                    <button className="icon-btn delete">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ◀ 이전
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
            >
              다음 ▶
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookManager;
