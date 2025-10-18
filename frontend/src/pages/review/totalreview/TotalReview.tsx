import React, { useState } from 'react';
import './TotalReview.css';

interface ReviewItem {
  id: number;
  category: string;
  title: string;
  date: string;
  author: string;
  views: number;
}

const TotalReview: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  
  const reviewData: ReviewItem[] = [
    { id: 24, category: '공지', title: '도서 관리 프로그램', date: '2024 - 04 - 05', author: '관리자', views: 12342513 },
    { id: 23, category: '공지', title: '영남이공대학교', date: '2024 - 04 - 01', author: '관리자', views: 1213 },
    { id: 22, category: '공지', title: '소프트웨어 콘텐츠', date: '2024 - 03 - 27', author: '관리자', views: 513 },
    { id: 21, category: '공지', title: '공지사항입니다.', date: '2024 - 03 - 21', author: '관리자', views: 13 },
    { id: 20, category: '행사', title: '기타', date: '2024 - 02 - 21', author: '관리자', views: 626576838 },
    { id: 19, category: '입고', title: '새로운 책이 입고 되었습니다.', date: '2024 - 02 - 20', author: '관리자', views: 9 },
    { id: 18, category: '공지', title: '공지 게시판 1', date: '2024 - 02 - 19', author: '관리자', views: 8764 },
    { id: 17, category: '공지', title: '공지 게시판입니다.', date: '2024 - 02 - 17', author: '관리자', views: 13546 },
  ];

  return (
    <div className="review-board-container">
      <div className="review-board-card">
        <h1 className="board-title">공지사항</h1>
        
        <div className="board-controls">
          <div className="filter-dropdown">
            <span className="filter-label">전체</span>
            <svg className="chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="search-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="제목을 입력하십시오."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 14L11.1 11.1M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header">
            <div className="header-cell col-number">번호</div>
            <div className="header-cell col-category">분류</div>
            <div className="header-cell col-title">제목</div>
            <div className="header-cell col-date">작성일</div>
            <div className="header-cell col-author">작성자</div>
            <div className="header-cell col-views">조회수</div>
          </div>

          <div className="table-divider"></div>

          <div className="table-body">
            {reviewData.map((item) => (
              <div key={item.id} className="table-row">
                <div className="table-cell col-number">{item.id}</div>
                <div className="table-cell col-category">{item.category}</div>
                <div className="table-cell col-title">{item.title}</div>
                <div className="table-cell col-date">{item.date}</div>
                <div className="table-cell col-author">{item.author}</div>
                <div className="table-cell col-views">{item.views}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="board-footer">
          <div className="footer-divider"></div>
          
          <div className="pagination-container">
            <button className="pagination-btn pagination-previous" disabled>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6673 7.99992H3.33398M3.33398 7.99992L8.00065 12.6666M3.33398 7.99992L8.00065 3.33325" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Previous</span>
            </button>

            <div className="pagination-pages">
              <button className="pagination-page">1</button>
              <button className="pagination-page">2</button>
              <button className="pagination-page active">3</button>
              <span className="pagination-gap">...</span>
              <button className="pagination-page">67</button>
              <button className="pagination-page">68</button>
            </div>

            <button className="pagination-btn pagination-next">
              <span>Next</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33398 7.99992H12.6673M12.6673 7.99992L8.00065 3.33325M12.6673 7.99992L8.00065 12.6666" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button className="write-btn">글쓰기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalReview;
