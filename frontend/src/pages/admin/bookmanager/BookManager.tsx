import React, { useEffect, useState, useCallback } from "react";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
} from "../../../api/BookApi";
import AddBookModal from "../../../components/modal/AddBookModal";
import UpdateBookModal from "../../../components/modal/UpdateBookModal";
import DeleteBookModal from "../../../components/modal/DeleteBookModal";
import "./BookManager.css";

const BookManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  // 모달 상태 관리
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // ✅ 목록 새로고침 함수

  const refreshBooks = useCallback(() => {
    getBooks(page, 10, keyword).then((data) => {
      setBooks(data.content);
      setTotalPages(data.totalPages);
    });
  }, [page, keyword]);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

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

  // ✅ 새 책 등록
  const handleAddBook = async (form: any) => {
    try {
      await addBook(form);
      alert("📚 도서가 성공적으로 등록되었습니다!");
      setIsAddOpen(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다 ❌");
    }
  };

  // ✅ 책 수정
  const handleUpdateBook = async (form: any) => {
    try {
      await updateBook(form);
      alert("✏️ 도서 정보가 수정되었습니다!");
      setIsUpdateOpen(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다 ❌");
    }
  };

  // ✅ 책 삭제
  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      await deleteBook(selectedBook.id);
      alert("🗑 도서가 삭제되었습니다!");
      setIsDeleteOpen(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다 ❌");
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-body">
        <main className="admin-content">
          <div className="book-header">
            <h2>📘 도서 관리</h2>
            <div className="book-actions">
              <button className="add-btn" onClick={() => setIsAddOpen(true)}>
                + Add Book
              </button>
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
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        setSelectedBook(b);
                        setIsUpdateOpen(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => {
                        setSelectedBook(b);
                        setIsDeleteOpen(true);
                      }}
                    >
                      🗑
                    </button>
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

      {/* ✅ 모달들 */}
      <AddBookModal
        isOpen={isAddOpen}
        onAdd={handleAddBook}
        onClose={() => setIsAddOpen(false)}
      />

      <UpdateBookModal
        isOpen={isUpdateOpen}
        book={selectedBook}
        onUpdate={handleUpdateBook}
        onClose={() => setIsUpdateOpen(false)}
      />

      <DeleteBookModal
        isOpen={isDeleteOpen}
        onConfirm={handleDeleteBook}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};

export default BookManager;
