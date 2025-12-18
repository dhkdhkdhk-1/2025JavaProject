import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks, Book, PageResponse } from "../../api/BookApi";
import "./BookList.css";

type UiBook = Book & {
  imageUrl?: string | null;
  description?: string | null;
};

const BookList: React.FC = () => {
  const navigate = useNavigate();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [genreFilters, setGenreFilters] = useState<Record<string, boolean>>({
    NOVEL: false,
    ESSAY: false,
    IT: false,
    HISTORY: false,
    SCIENCE: false,
    OTHER: false,
  });
  const [sortOrder, setSortOrder] = useState<"新着順" | "評価順">("新着順");

  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(9);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [data, setData] = useState<PageResponse<UiBook>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  });

  // ✅ 필터 제거
  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));
  };

  // ✅ 장르 토글
  const toggleGenreFilter = (genre: string) => {
    setGenreFilters((prev) => {
      const newFilters = { ...prev, [genre]: !prev[genre] };
      setPage(0);
      return newFilters;
    });
  };

  // ✅ 장르 체크 상태 변경 시 selectedFilters 자동 업데이트
  useEffect(() => {
    const activeGenres = Object.keys(genreFilters).filter((g) => genreFilters[g]);
    setSelectedFilters(activeGenres);
  }, [genreFilters]);

  const placeholder = "https://placehold.co/357x492?text=No+Image"

  // ✅ 장르 + 검색어 + 정렬 반영된 목록 가져오기
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setErrorMsg("");

        const selectedGenres = Object.keys(genreFilters).filter((g) => genreFilters[g]);
        const res = await getBooks(page, size, keyword.trim(), selectedGenres);

        // ✅ 정렬 적용 (프론트 단)
        let sortedContent = [...res.content];
        if (sortOrder === "評価順") {
          sortedContent.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }

        if (!cancelled) {
          setData({
            ...res,
            content: sortedContent.map((b) => ({
              ...b,
              imageUrl: b.imageUrl ?? placeholder,
              description: b.description ?? null,
            })),
          });
        }
      } catch {
        if (!cancelled) setErrorMsg("リストの読み込み中に問題が発生しました.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [page, size, keyword, genreFilters, sortOrder]);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setPage(0);
  };

  const gotoPage = (p: number) => {
    if (p < 0 || p >= data.totalPages) return;
    setPage(p);
  };

  const pages = React.useMemo(() => {
    const arr: number[] = [];
    const total = data.totalPages;
    const current = page;
    const windowSize = 5;
    if (total <= 1) return [0];

    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, start + windowSize - 1);
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [data.totalPages, page]);

  return (
    <div className="book-list-page">
      <h2 className="page-title">書籍一覧</h2>

      <div className="book-list-layout">
        {/* ✅ 왼쪽 필터 메뉴 */}
        <aside className="filter-menu">
          <div className="filter-section">
            <div className="section-title">選択されたジャンル</div>
            <div className="keyword-list">
              {selectedFilters.map((filter, index) => (
                <div
                  key={index}
                  className="filter-tag"
                  onClick={() => removeFilter(filter)}
                >
                  <span className="tag-label">{filter}</span>
                  <svg
                    className="remove-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="#1E1E1E"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="section-title">ジャンル</div>
          <div className="checkbox-group">
            {Object.entries(genreFilters).map(([genre, checked]) => (
              <div key={genre} className="checkbox-field">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    className="native-checkbox"
                    checked={checked}
                    onChange={() => toggleGenreFilter(genre)}
                  />
                  <span className={`checkbox ${checked ? "checked" : ""}`}>
                    {checked && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13.3327 4L5.99935 11.3333L2.66602 8"
                          stroke="#F5F5F5"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="checkbox-label">{genre}</span>
                </label>
              </div>
            ))}
          </div>
        </aside>

        {/* ✅ 오른쪽 메인 목록 */}
        <section className="main-content">
          <div className="filter-bar">
            {/* 검색창 */}
            <div className="search-filter">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                />
                <svg
                  className="search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14 14L11.1 11.1M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
                    stroke="#1E1E1E"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* 정렬 버튼 */}
            <div className="sort-toggles">
              {(["新着順", "評価順"] as const).map((option) => (
                <div
                  key={option}
                  className={`sort-toggle ${sortOrder === option ? "active" : ""}`}
                  onClick={() => setSortOrder(option)}
                >
                  {sortOrder === option && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3327 4L5.99935 11.3333L2.66602 8"
                        stroke="#F5F5F5"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span className="sort-label">{option}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 상태 표시 */}
          {loading && <div style={{ padding: 8 }}>Loading...</div>}
          {errorMsg && <div style={{ padding: 8, color: "crimson" }}>{errorMsg}</div>}
          {!loading && data.totalElements === 0 && (
            <div style={{ padding: 8 }}>検索結果がありません.</div>
          )}

          {/* 도서 목록 */}
          <div className="books-grid">
            {data.content.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => navigate(`/book/${book.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="book-image">
                  <img
                    src={
                      book.imageUrl && book.imageUrl.trim() !== ""
                        ? book.imageUrl
                        : placeholder
                    }
                    alt={book.title}
                    className="book-image"
                    onError={(e) => {
                      const img = e.currentTarget;

                      // ⭐ 이미 placeholder면 더 이상 처리하지 않음
                      if (img.src === placeholder) return;

                      img.src = placeholder;
                    }}
                  />
                </div>
                <div className="book-info">
                  <div className="book-title">{book.title}</div>
                  <div className="book-author">{book.author}</div>
                  <div className="book-rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill={i < Math.round(book.rating ?? 0) ? "#FFD700" : "none"}
                        stroke="#2C2C2C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.99935 1.66675L12.5743 6.88341L18.3327 7.72508L14.166 11.7834L15.1493 17.5167L9.99935 14.8084L4.84935 17.5167L5.83268 11.7834L1.66602 7.72508L7.42435 6.88341L9.99935 1.66675Z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="pagination">
            <div
              className={`pagination-previous ${page === 0 ? "disabled" : ""}`}
              onClick={() => gotoPage(page - 1)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12.6673 7.99992H3.33398M3.33398 7.99992L8.00065 12.6666M3.33398 7.99992L8.00065 3.33325"
                  stroke="#1E1E1E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>前へ</span>
            </div>

            <div className="pagination-list">
              {pages[0] > 0 && (
                <div className="pagination-page" onClick={() => gotoPage(0)}>
                  1
                </div>
              )}
              {pages[0] > 1 && <div className="pagination-gap">...</div>}

              {pages.map((p) => (
                <div
                  key={p}
                  className={`pagination-page ${p === page ? "current" : ""}`}
                  onClick={() => gotoPage(p)}
                >
                  {p + 1}
                </div>
              ))}

              {pages[pages.length - 1] < data.totalPages - 2 && (
                <div className="pagination-gap">...</div>
              )}
              {pages[pages.length - 1] < data.totalPages - 1 && (
                <div
                  className="pagination-page"
                  onClick={() => gotoPage(data.totalPages - 1)}
                >
                  {data.totalPages}
                </div>
              )}
            </div>

            <div
              className={`pagination-next ${
                page >= data.totalPages - 1 ? "disabled" : ""
              }`}
              onClick={() => gotoPage(page + 1)}
            >
              <span>次へ</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3.33398 7.99992H12.6673M12.6673 7.99992L8.00065 3.33325M12.6673 7.99992L8.00065 12.6666"
                  stroke="#1E1E1E"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookList;
