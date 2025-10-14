import React, { useState } from 'react';
import './BookInfo.css';

const BookInfo = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('대구 북구');

  const StarRating = ({ rating = 5 }) => (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="star-icon"
        >
          <path
            d="M10.0003 1.6665L12.5753 6.88317L18.3337 7.72484L14.167 11.7832L15.1503 17.5165L10.0003 14.8082L4.85033 17.5165L5.83366 11.7832L1.66699 7.72484L7.42533 6.88317L10.0003 1.6665Z"
            stroke="#2C2C2C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );

  const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.3671 3.84172C16.9415 3.41589 16.4361 3.0781 15.8799 2.84763C15.3237 2.61716 14.7275 2.49854 14.1254 2.49854C13.5234 2.49854 12.9272 2.61716 12.371 2.84763C11.8147 3.0781 11.3094 3.41589 10.8838 3.84172L10.0004 4.72506L9.11709 3.84172C8.25735 2.98198 7.09129 2.49898 5.87543 2.49898C4.65956 2.49898 3.4935 2.98198 2.63376 3.84172C1.77401 4.70147 1.29102 5.86753 1.29102 7.08339C1.29102 8.29925 1.77401 9.46531 2.63376 10.3251L10.0004 17.6917L17.3671 10.3251C17.7929 9.89943 18.1307 9.39407 18.3612 8.83785C18.5917 8.28164 18.7103 7.68546 18.7103 7.08339C18.7103 6.48132 18.5917 5.88514 18.3612 5.32893C18.1307 4.77271 17.7929 4.26735 17.3671 3.84172Z"
        stroke="#F5F5F5"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ChevronIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="book-info-page">
      {/* Main Product Section */}
      <section className="product-section">
        <div className="product-container">
          <div className="product-content">
            <div className="product-details">
              <div className="breadcrumb">국내 &gt; 소설</div>

              <div className="title-section">
                <h1 className="book-title">제목 입력</h1>
                <div className="genre-tag">소설</div>
              </div>

              <div className="author-section">
                <span className="author-text">저자 입력</span>
              </div>

              <div className="rental-status">대여 가능</div>

              <div className="accordion-container">
                <div className={`accordion-item ${isAccordionOpen ? 'open' : ''}`}>
                  <div
                    className="accordion-header"
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  >
                    <h3 className="accordion-title">2024 노벨문학상 수상작가</h3>
                  </div>
                  {isAccordionOpen && (
                    <div className="accordion-content">
                      <p className="accordion-text">
                        저자는 이 작품에서 진심 어린 문장들로 무고한 영혼의 말을 대신 전하며 그 시절을 잊고 무심하게 살아가는 우리에게 묵직한 메시지를 던진다. 
                        국가의 무자비함을 생생하게 그려내 지금까지도 우리나라뿐 아니라 전 세계에서 계속되고 있는 인간의 잔혹함과 악행에 대한 근원적인 질문을 던지고, 
                        잊을 수 없는 봄날의 오월을 지나 여름을 건너가지 못한 이들과 살아남은 것이 오히려 치욕으로 여기며 매일을 힘겹게 견뎌내는 이들에게 우리가 어떤 대답을 해줄 수 있는 가를 간절한 목소리로 묻는다. 
                        그리하여 우리가 붙들어야 할 역사적 기억이 무엇인지 생각하게 한다.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="product-image-container">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/fb679e50f7bc0277d2bebdbd4a031dad6392d6d7?width=714"
                alt="Book cover"
                className="book-image"
              />
              <button className="favorite-button">
                <HeartIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-container">
          <div className="reviews-header">
            <h2 className="reviews-title">리뷰</h2>
            <a href="#" className="view-more-link">리뷰 더보기</a>
          </div>

          <div className="reviews-grid">
            {[1, 2, 3].map((index) => (
              <div key={index} className="review-card">
                <StarRating />

                <div className="review-content">
                  <h3 className="review-title">Review title</h3>
                  <p className="review-body">Review body</p>
                </div>

                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    <img
                      src={`https://api.builder.io/api/v1/image/assets/TEMP/${index === 1 ? 'b5746e2ba8de52487eba4d5a1dd05f3f0a50dcf6' : index === 2 ? 'f027e4b7a03de55fae421cd9c5b16b4aaa547c0c' : '000985bb1e08c69d8d65c82bac443d2e9c73efc6'}?width=80`}
                      alt="Reviewer avatar"
                      className="avatar-image"
                    />
                  </div>
                  <div className="reviewer-details">
                    <div className="reviewer-name">Reviewer name</div>
                    <div className="review-date">Date</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Selector */}
      <section className="location-section">
        <div className="location-container">
          <div className="location-field">
            <label className="location-label">지점</label>
            <div className="location-select" onClick={() => setSelectedLocation('대구 북구')}>
              <span className="location-value">{selectedLocation}</span>
              <ChevronIcon />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookInfo;
