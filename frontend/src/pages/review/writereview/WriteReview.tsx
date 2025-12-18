import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./WriteReview.css";
import { getBook } from "../../../api/BookApi";
import { writeReview } from "../../../api/ReviewApi";

const WriteReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (!id) return;
        console.log("📘 Fetching book id:", id);
        const data = await getBook(Number(id));
        console.log("📗 getBook response:", data);
        setBook(data);
      } catch (error) {
        console.error("❌ getBook error:", error);
        alert("도서 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleStarClick = (index: number) => setRating(index + 1);

  const handleSubmit = async () => {
    if (!id) return alert("잘못된 접근입니다.");
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await writeReview(Number(id), { title, comment: content, rating });
      alert("리뷰가 등록되었습니다!");
      navigate(`/rental`);
    } catch (error) {
      console.error(error);
      alert("리뷰 등록 실패 이미 등록되어있습니다");
    }
  };

  if (loading) return <div className="loading">불러오는 중...</div>;
  if (!book) return <div className="error">도서 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="page-product">
      <div className="product-section">
        <img
          className="product-image"
          src={
            book.imageUrl || "https://via.placeholder.com/300x400?text=No+Image"
          }
          alt={book.title}
        />
        <div className="product-info-column">
          <div className="product-body">
            <div className="product-title-section">
              <div className="product-title-wrapper">
                <div className="product-category">📚 {book.category}</div>
                <div className="product-author">✍ {book.author}</div>
                <div className="product-publisher">🏢 {book.publisher}</div>
              </div>
              <div className="product-title">
                <span className="title-text">{book.title}</span>
              </div>
            </div>
            {book.description && (
              <div className="product-description">{book.description}</div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ 리뷰 작성 영역 */}
      <div className="review-section">
        <div className="review-card">
          <div className="rating-container">
            {[...Array(5)].map((_, index) => (
              <svg
                key={index}
                onClick={() => handleStarClick(index)}
                className={`star-icon ${index < rating ? "filled" : ""}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99935 1.66675L12.5743 6.88341L18.3327 7.72508L14.166 11.7834L15.1493 17.5167L9.99935 14.8084L4.84935 17.5167L5.83268 11.7834L1.66602 7.72508L7.42435 6.88341L9.99935 1.66675Z"
                  stroke="#2C2C2C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>

          <div className="review-body">
            <div className="review-title-input">
              <input
                type="text"
                placeholder="리뷰 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="title-input"
              />
            </div>
            <div className="review-content-input">
              <textarea
                placeholder="리뷰 내용을 입력하세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="content-textarea"
              />
            </div>
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          ✅ 리뷰 등록
        </button>
      </div>
    </div>
  );
};

export default WriteReview;
