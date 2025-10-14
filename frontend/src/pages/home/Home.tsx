import React, { useEffect, useState } from "react";
import { getLatestBooks, Book } from "../../api/BookApi";
import "./Home.css";

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

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

  useEffect(() => {
    fetch('http://localhost:8080/book/list?page=0&size=5') // ✅ 백엔드 API 호출
      .then(res => res.json())
      .then((data) => {
        console.log("📚 백엔드 응답:", data);
        setBooks(data.content); // ✅ content 배열만 저장
      })
      .catch(err => console.error("❌ 책 목록 불러오기 오류:", err));
    const fetchBooks = async () => {
      const data = await getLatestBooks(); // 최신 5권 가져오기
      setBooks(data);
    };
    fetchBooks();
  }, []);

  const announcements = [
    "공지사항 1 - 테스트용 공지",
    "공지사항 2 - 테스트용 공지",
    "공지사항 3 - 테스트용 공지",
  ];

  return (
    <div className="home-container">
      {/* Hero 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">도서 관리 페이지</h1>
        </div>
      </section>

      {/* 공지사항 섹션 */}
      <section className="announcements-section">
        {announcements.map((item, idx) => (
          <div key={idx} className="announcement-item">
            {item}
          </div>
        ))}
      </section>

      {/* 책 목록 섹션 */}
      <section className="books-section">
        {books.length === 0 ? (
          <p>책이 없습니다.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={book.imageUrl || "https://via.placeholder.com/150"}
                alt={book.title}
                className="book-image"
              />
              <div className="book-info">
                <div className="book-title">{book.title}</div>
                <div className="book-author">저자: {book.author}</div>
                <div className="book-category">
                  카테고리: {translateCategory(book.category)}
                </div>
                <div className="book-description">{book.description || ""}</div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Home;
