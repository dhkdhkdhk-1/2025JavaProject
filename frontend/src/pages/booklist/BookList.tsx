// import React, { useEffect, useMemo, useState } from "react";
// import { getBooks, Book, PageResponse } from "../../api/BookApi";
// import "./BookList.css";

// type UiBook = Book & {
//   imageUrl?: string | null;
//   description?: string | null;
// };

// const BookList: React.FC = () => {
//   // 필터 상태 (UI)
//   const [selectedFilters, setSelectedFilters] = useState<string[]>(["소설"]);
//   const [genreFilters, setGenreFilters] = useState<Record<string, boolean>>({
//     "소설": true,
//     "에세이": false,
//     "IT": false,
//     "역사": false,
//     "과학": false,
//     "그외": false,
//   });
//   const [sortOrder, setSortOrder] = useState<"최신순" | "인기순" | "평점순">("최신순");

//   // 검색/페이지 상태 (실제 API 연동)
//   const [keyword, setKeyword] = useState<string>("");
//   const [page, setPage] = useState<number>(0);
//   const [size] = useState<number>(9); // ✅ 3x3 그리드
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errorMsg, setErrorMsg] = useState<string>("");

//   const [data, setData] = useState<PageResponse<UiBook>>({
//     content: [],
//     totalPages: 0,
//     totalElements: 0,
//     number: 0,
//   });

//   // UI 동작
//   const removeFilter = (filter: string) => {
//     setSelectedFilters((prev) => prev.filter((f) => f !== filter));
//   };
//   const toggleGenreFilter = (genre: string) => {
//     setGenreFilters((prev) => ({ ...prev, [genre]: !prev[genre] }));
//   };

//   // 이미지 placeholder
//   const placeholder = useMemo(
//     () => "https://via.placeholder.com/148x206?text=No+Image",
//     []
//   );

//   // 데이터 불러오기
//   useEffect(() => {
//     let cancelled = false;
//     async function fetchData() {
//       try {
//         setLoading(true);
//         setErrorMsg("");
//         const res = await getBooks(page, size, keyword.trim());
//         if (!cancelled) {
//           setData({
//             ...res,
//             content: res.content.map((b: any) => ({
//               ...b,
//               imageUrl: b.imageUrl ?? null,
//               description: b.description ?? null,
//             })),
//           });
//         }
//       } catch {
//         if (!cancelled) setErrorMsg("목록을 불러오는 중 문제가 발생했어요.");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     fetchData();
//     return () => {
//       cancelled = true;
//     };
//   }, [page, size, keyword]);

//   const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") setPage(0);
//   };

//   const gotoPage = (p: number) => {
//     if (p < 0 || p >= data.totalPages) return;
//     setPage(p);
//   };

//   // 페이징 표시 목록
//   const pages = React.useMemo(() => {
//     const arr: number[] = [];
//     const total = data.totalPages;
//     const current = page;
//     const windowSize = 5;
//     if (total <= 1) return [0];

//     const start = Math.max(0, current - 2);
//     const end = Math.min(total - 1, start + windowSize - 1);
//     for (let i = start; i <= end; i++) arr.push(i);
//     return arr;
//   }, [data.totalPages, page]);

//   return (
//     <div className="book-list-page">
//       {/* 페이지 제목 */}
//       <h2 className="page-title">도서목록</h2>

//       {/* 2열 레이아웃 */}
//       <div className="book-list-layout">
//         {/* 왼쪽 사이드바 */}
//         <aside className="filter-menu">
//           <div className="filter-section">
//             <div className="section-title">선택</div>
//             <div className="keyword-list">
//               {selectedFilters.map((filter, index) => (
//                 <div key={index} className="filter-tag" onClick={() => removeFilter(filter)}>
//                   <span className="tag-label">{filter}</span>
//                   <svg className="remove-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
//                     <path d="M12 4L4 12M4 4L12 12" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                   </svg>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="section-title">장르</div>
//           <div className="checkbox-group">
//             {Object.entries(genreFilters).map(([genre, checked]) => (
//               <div key={genre} className="checkbox-field">
//                 <label className="checkbox-container">
//                   <input
//                     type="checkbox"
//                     className="native-checkbox"
//                     checked={checked}
//                     onChange={() => toggleGenreFilter(genre)}
//                   />
//                   <span className={`checkbox ${checked ? "checked" : ""}`}>
//                     {checked && (
//                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                         <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="#F5F5F5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     )}
//                   </span>
//                   <span className="checkbox-label">{genre}</span>
//                 </label>
//               </div>
//             ))}
//           </div>
//         </aside>

//         {/* 오른쪽 본문 */}
//         <section className="main-content">
//           <div className="filter-bar">
//             <div className="search-filter">
//               <div className="search-input">
//                 <input
//                   type="text"
//                   placeholder="Search"
//                   value={keyword}
//                   onChange={(e) => setKeyword(e.target.value)}
//                   onKeyDown={onSearchKeyDown}
//                 />
//                 <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
//                   <path d="M14 14L11.1 11.1M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               </div>
//             </div>

//             <div className="sort-toggles">
//               {(["최신순", "인기순", "평점순"] as const).map((option) => (
//                 <div
//                   key={option}
//                   className={`sort-toggle ${sortOrder === option ? "active" : ""}`}
//                   onClick={() => setSortOrder(option)}
//                   title="(TODO) 백엔드 정렬 파라미터 붙이기"
//                 >
//                   {sortOrder === option && (
//                     <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                       <path d="M13.3327 4L5.99935 11.3333L2.66602 8" stroke="#F5F5F5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   )}
//                   <span className="sort-label">{option}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {loading && <div style={{ padding: 8 }}>불러오는 중...</div>}
//           {errorMsg && <div style={{ padding: 8, color: "crimson" }}>{errorMsg}</div>}
//           {!loading && data.totalElements === 0 && <div style={{ padding: 8 }}>검색 결과가 없습니다.</div>}

//           <div className="books-grid">
//             {data.content.map((book) => (
//               <div key={book.id} className="book-card">
//                 <div className="book-image">
//                   <img
//                     src={(book as any).imageUrl || placeholder}
//                     alt={book.title}
//                     onError={(e) => ((e.target as HTMLImageElement).src = placeholder)}
//                   />
//                 </div>
//                 <div className="book-info">
//                   <div className="book-title">{book.title}</div>
//                   <div className="book-author">{book.author}</div>
//                   <div className="book-rating">
//                     {[...Array(5)].map((_, i) => (
//                       <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
//                         <path d="M9.99935 1.66675L12.5743 6.88341L18.3327 7.72508L14.166 11.7834L15.1493 17.5167L9.99935 14.8084L4.84935 17.5167L5.83268 11.7834L1.66602 7.72508L7.42435 6.88341L9.99935 1.66675Z" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                       </svg>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="pagination">
//             <div
//               className={`pagination-previous ${page === 0 ? "disabled" : ""}`}
//               onClick={() => gotoPage(page - 1)}
//             >
//               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                 <path d="M12.6673 7.99992H3.33398M3.33398 7.99992L8.00065 12.6666M3.33398 7.99992L8.00065 3.33325" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               <span>Previous</span>
//             </div>

//             <div className="pagination-list">
//               {pages[0] > 0 && <div className="pagination-page" onClick={() => gotoPage(0)}>1</div>}
//               {pages[0] > 1 && <div className="pagination-gap">...</div>}

//               {pages.map((p) => (
//                 <div
//                   key={p}
//                   className={`pagination-page ${p === page ? "current" : ""}`}
//                   onClick={() => gotoPage(p)}
//                 >
//                   {p + 1}
//                 </div>
//               ))}

//               {pages[pages.length - 1] < data.totalPages - 2 && <div className="pagination-gap">...</div>}
//               {pages[pages.length - 1] < data.totalPages - 1 && (
//                 <div className="pagination-page" onClick={() => gotoPage(data.totalPages - 1)}>
//                   {data.totalPages}
//                 </div>
//               )}
//             </div>

//             <div
//               className={`pagination-next ${page >= data.totalPages - 1 ? "disabled" : ""}`}
//               onClick={() => gotoPage(page + 1)}
//             >
//               <span>Next</span>
//               <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                 <path d="M3.33398 7.99992H12.6673M12.6673 7.99992L8.00065 3.33325M12.6673 7.99992L8.00065 12.6666" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default BookList;
// export default function BookList() {
//   return <h2>도서 목록 페이지</h2>;
// }
