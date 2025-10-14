import React, { useEffect, useState } from "react";
import "./Home.css";

interface BookCard {
  id: number;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
}

export default function Home() {
  const [books, setBooks] = useState<BookCard[]>([]);

  const announcements = [
    "공지사항 1- 테스트용 공지",
    "공지사항 2- 테스트용 공지",
    "공지사항 3- 테스트용 공지",
  ];

<<<<<<< HEAD
useEffect(() => {
  fetch('http://localhost:8080/book/recent?size=5') // ★ 최근 5권 엔드포인트
    .then(res => res.json())
    .then((data) => {
      // recent는 Page가 아니라 배열! content가 아님
      setBooks(
        data.map((b: any) => ({
          ...b,
          imageUrl: b.imageUrl ?? null,
          description: b.description ?? null,
        }))
      );
    })
    .catch(err => console.error("❌ 최신 도서 불러오기 오류:", err));
}, []);
=======
  useEffect(() => {
    fetch("http://localhost:8080/book/list?page=0&size=5") // ✅ 백엔드 API 호출
      .then((res) => res.json())
      .then((data) => {
        console.log("📚 백엔드 응답:", data);
        setBooks(data.content); // ✅ content 배열만 저장
      })
      .catch((err) => console.error("❌ 책 목록 불러오기 오류:", err));
  }, []);
>>>>>>> 269432835d449995c459c8c1a320f7ccce3a66c5

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
        {announcements.map((announcement, index) => (
          <div key={index} className="announcement-item">
            {announcement}
          </div>
        ))}
      </section>

      {/* Books Section */}
      <section className="books-section">
        {books.map((book) => (
          <div key={book.id} className="book-card">
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
