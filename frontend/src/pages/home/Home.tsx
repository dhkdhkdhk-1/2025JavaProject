// src/pages/home/Home.tsx
import React, { useEffect, useState } from "react";
import "./Home.css";
import { getRecentBooks, Book } from "../../api/BookApi";
import { useNavigate } from "react-router-dom";

type BookCard = Book;

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookCard[]>([]);

  const announcements = [
    "お知らせ １ - Test",
    "お知らせ 2 - Test",
    "お知らせ 3 - Test",
  ];

  // ✅ 최신 도서 불러오기 (API 함수만 사용)
  useEffect(() => {
    getRecentBooks(5)
      .then((data) => setBooks(data))
      .catch((err) => console.error("❌ 최신 도서 불러오기 오류:", err));
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
        {announcements.map((announcement, index) => (
          <div key={index} className="announcement-item">
            {announcement}
          </div>
        ))}
      </section>

      {/* Books Section */}
      <section className="books-section">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => navigate(`/book/${book.id}`)} // ✅ 클릭 시 상세 페이지 이동
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
