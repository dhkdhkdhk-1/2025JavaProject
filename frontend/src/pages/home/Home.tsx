// src/pages/home/Home.tsx
import React, { useEffect, useState } from "react";
import "./Home.css";
import { getRecentBooks, Book } from "../../api/BookApi";
import { getLatestNotices } from "../../api/BoardApi";
import { useNavigate } from "react-router-dom";

type BookCard = Book;

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookCard[]>([]);
  const [notices, setNotices] = useState<any[]>([]); // BoardResponse 타입 있으면 변경 가능

<<<<<<< HEAD
  const announcements = [
    "お知らせ １ - Test",
    "お知らせ 2 - Test",
    "お知らせ 3 - Test",
  ];

  // ✅ 최신 도서 불러오기 (API 함수만 사용)
=======
  // 최신 도서 & 최신 공지사항 가져오기
>>>>>>> accountinfo
  useEffect(() => {
    // 최신 도서
    getRecentBooks(5)
      .then((data) => setBooks(data))
      .catch((err) => console.error("❌ 최신 도서 불러오기 오류:", err));

    // 최신 공지사항 3개
    getLatestNotices()
      .then((data) => setNotices(data))
      .catch((err) => console.error("❌ 최신 공지사항 불러오기 오류:", err));
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">図書管理ページ</h1>
        </div>
      </section>
      {/* Announcements Section */}
      <section className="announcements-section">
        {[...notices, ...Array(3 - notices.length).fill(null)].map(
          (notice, index) => (
            <div
              key={notice ? notice.id : `empty-${index}`}
              className="announcement-item"
              onClick={() => notice && navigate(`/board/${notice.id}`)}
              style={{
                cursor: notice ? "pointer" : "default",
              }}
            >
              <div className="announcement-line">
                タイトル{" : "}
                <span className="announcement-title">
                  {notice ? notice.title : "告知がありません。"}
                </span>
                {"  "}投稿日{" : "}
                <span className="announcement-date">
                  {notice ? notice.createdAt.slice(0, 10) : "-"}
                </span>
              </div>
            </div>
          )
        )}
      </section>

      {/* Books Section */}
      <section className="books-section">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => navigate(`/book/${book.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={book.imageUrl || "https://via.placeholder.com/150"}
              alt={book.title}
              className="book-image"
            />
            <div className="book-info">
              <div className="book-title">{book.title}</div>
              <div className="book-author">著者: {book.author}</div>
              <div className="book-description">{book.description}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
