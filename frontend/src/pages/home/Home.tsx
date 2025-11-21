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

  // 최신 도서 & 최신 공지사항 가져오기
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
          <h1 className="hero-title">도서관리페이지</h1>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="announcement-item"
            onClick={() => navigate(`/board/detail/${notice.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="announcement-title">{notice.title}</div>
            <div className="announcement-date">
              {notice.createdAt.slice(0, 10)}
            </div>
          </div>
        ))}

        {notices.length === 0 && (
          <div className="announcement-item">등록된 공지사항이 없습니다.</div>
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
              <div className="book-author">저자: {book.author}</div>
              <div className="book-description">{book.description}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
