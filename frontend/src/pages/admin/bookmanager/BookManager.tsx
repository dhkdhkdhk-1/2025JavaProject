import React, { useEffect, useState, useCallback } from "react";
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  Book,
  BookForm,
} from "../../../api/BookApi";
import AddBookModal from "../../../components/modal/bookmodal/AddBookModal";
import UpdateBookModal from "../../../components/modal/bookmodal/UpdateBookModal";
import DeleteBookModal from "../../../components/modal/bookmodal/DeleteBookModal";
import "./BookManager.css";

const BookManager: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
        return "小説";
      case "ESSAY":
        return "エッセイ";
      case "IT":
        return "IT";
      case "HISTORY":
        return "歴史";
      case "SCIENCE":
        return "科学";
      default:
        return "その他";
    }
  };

  // ✅ 등록: (form, file)로 받기
  const handleAddBook = async (form: BookForm, file?: File | null) => {
    try {
      await addBook(form, file ?? null);
      alert("📚 本が正常に登録されました！");
      setIsAddOpen(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      alert("登録中にエラーが発生しました ❌");
    }
  };

  // ✅ 수정: (form, file)로 받기
  const handleUpdateBook = async (
    id: number,
    form: BookForm,
    file?: File | null
  ) => {
    try {
      await updateBook(id, form, file ?? null);
      alert("✏️ 本の情報が修正されました！");
      setIsUpdateOpen(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      alert("修正中にエラーが発生しました ❌");
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      await deleteBook(selectedBook.id);
      alert("🗑 本が削除されました！");
      setIsDeleteOpen(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      alert("削除中にエラーが発生しました ❌");
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-body">
        <main className="admin-content">
          <div className="book-header">
            <h2>📘 書籍管理</h2>
            <div className="book-actions">
              <button className="add-btn" onClick={() => setIsAddOpen(true)}>
                + 本を追加
              </button>
              <input
                type="text"
                placeholder="タイトルで検索..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <table className="book-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>タイトル</th>
                <th>著者</th>
                <th>出版社</th>
                <th>カテゴリ</th>
                <th>貸出可否</th>
                <th>操作</th>
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
                  <td>{b.available ? "可能" : "不可"}</td>
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
              ◀ 前へ
            </button>
            <span>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
            >
              次へ ▶
            </button>
          </div>
        </main>
      </div>

      <AddBookModal
        isOpen={isAddOpen}
        onAdd={handleAddBook} // ✅ (form, file) 받는 형태
        onClose={() => setIsAddOpen(false)}
      />

      <UpdateBookModal
        isOpen={isUpdateOpen}
        book={selectedBook}
        onUpdate={handleUpdateBook} // ✅ (form, file)
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
