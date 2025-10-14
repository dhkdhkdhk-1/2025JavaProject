import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookInfo.css";
import { getBook, BookDetail } from "../../api/BookApi";

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("대구 북구");

  const placeholder = "https://via.placeholder.com/357x492?text=No+Image";

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setErr("");

        if (!id || isNaN(Number(id))) {
          setErr("잘못된 접근입니다. (id 없음)");
          return;
        }

        const data = await getBook(Number(id));
        if (!cancelled) setBook(data);
      } catch (e) {
        if (!cancelled) setErr("도서 정보를 불러오지 못했어요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div style={{ padding: 16 }}>불러오는 중...</div>;
  if (err) return <div style={{ padding: 16, color: "crimson" }}>{err}</div>;
  if (!book) return <div style={{ padding: 16 }}>도서를 찾을 수 없어요.</div>;

  return (
    <div className="book-info-page">
      <section className="product-section">
        <div className="product-container">
          <div className="product-content">
            <div className="product-details">
              <div className="breadcrumb">국내 &gt; {book.category ?? "분류없음"}</div>

              <div className="title-section">
                <h1 className="book-title">{book.title}</h1>
                <div className="genre-tag">{book.category ?? "분류없음"}</div>
              </div>

              <div className="author-section">
                <span className="author-text">
                  저자: {book.author} | 출판사: {book.publisher}
                </span>
              </div>

              <div className="rental-status">
                {book.available ? "대여 가능" : "대여 중"}
              </div>

              <div className="accordion-container">
                <div className={`accordion-item ${isAccordionOpen ? "open" : ""}`}>
                  <div
                    className="accordion-header"
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  >
                    <h3 className="accordion-title">책 소개</h3>
                  </div>
                  {isAccordionOpen && (
                    <div className="accordion-content">
                      <p className="accordion-text">
                        {book.description ?? "소개/줄거리 정보가 없습니다."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="product-image-container">
              <img
                src={book.imageUrl || placeholder}
                alt={book.title}
                className="book-image"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = placeholder)
                }
              />
              <button className="favorite-button" title="관심도서">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M17.3671 3.84172C16.9415 3.41589 16.4361 3.0781 15.8799 2.84763C15.3237 2.61716 14.7275 2.49854 14.1254 2.49854C13.5234 2.49854 12.9272 2.61716 12.371 2.84763C11.8147 3.0781 11.3094 3.41589 10.8838 3.84172L10.0004 4.72506L9.11709 3.84172C8.25735 2.98198 7.09129 2.49898 5.87543 2.49898C4.65956 2.49898 3.4935 2.98198 2.63376 3.84172C1.77401 4.70147 1.29102 5.86753 1.29102 7.08339C1.29102 8.29925 1.77401 9.46531 2.63376 10.3251L10.0004 17.6917L17.3671 10.3251C17.7929 9.89943 18.1307 9.39407 18.3612 8.83785C18.5917 8.28164 18.7103 7.68546 18.7103 7.08339C18.7103 6.48132 18.5917 5.88514 18.3612 5.32893C18.1307 4.77271 17.7929 4.26735 17.3671 3.84172Z"
                    stroke="#F5F5F5"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 리뷰 섹션 연동은 추후 /review/book/{id}로 추가 */}
      <section className="location-section">
        <div className="location-container">
          <div className="location-field">
            <label className="location-label">지점</label>
            <div
              className="location-select"
              onClick={() => setSelectedLocation("대구 북구")}
            >
              <span className="location-value">{selectedLocation}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 6L8 10L12 6"
                  stroke="#1E1E1E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookInfo;
