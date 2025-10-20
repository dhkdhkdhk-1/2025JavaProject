import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBoardList, BoardResponse } from "../../api/BoardApi";
import BoardTable from "./components/BoardTable";
import axios from "axios";
import "./board.css";

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [allBoards, setAllBoards] = useState<BoardResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ 기본 검색 조건을 "제목+내용"으로 설정
  const [searchType, setSearchType] = useState("제목+내용");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("전체");

  const navigate = useNavigate();
  const location = useLocation();

  /** ✅ 전체 게시글 불러오기 */
  const fetchAllBoards = useCallback(async () => {
    try {
      let all: BoardResponse[] = [];
      let pageNum = 0;
      let hasMore = true;

      while (hasMore) {
        const res = await getBoardList(pageNum, "", "제목+내용", "전체");
        all = [...all, ...res.data.content];
        hasMore = pageNum < res.data.totalPages - 1;
        pageNum++;
      }

      setAllBoards(all);
      setTotalElements(all.length);
    } catch (error) {
      console.error("전체 게시글 불러오기 실패:", error);
    }
  }, []);

  /** ✅ 현재 조건의 게시글 불러오기 */
  const fetchBoards = useCallback(
    async (
      pageNum: number,
      keywordStr: string,
      searchTypeStr: string,
      categoryStr: string
    ) => {
      try {
        setLoading(true);
        setErrorMsg("");
        const res = await getBoardList(
          pageNum,
          keywordStr,
          searchTypeStr,
          categoryStr
        );

        if (res.data.content.length === 0) {
          setBoards([]);
          setErrorMsg("🔍 해당 조건에 맞는 게시글이 없습니다.");
        } else {
          setBoards(res.data.content);
        }

        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        } else {
          setErrorMsg("❌ 데이터를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  /** ✅ URL 변경 시 새 데이터 가져오기 */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSearchType = params.get("searchType") || "제목+내용";
    const newKeyword = params.get("keyword") || "";
    const newCategory = params.get("category") || "전체";
    const newPage = parseInt(params.get("page") || "0", 10);

    setSearchType(newSearchType);
    setKeyword(newKeyword);
    setCategory(newCategory);
    setPage(newPage);

    fetchAllBoards();
    fetchBoards(newPage, newKeyword, newSearchType, newCategory);
  }, [location.search, fetchBoards, fetchAllBoards]);

  /** ✅ 검색 실행 */
  const handleSearch = () => {
    const query = new URLSearchParams();
    if (keyword.trim()) query.append("keyword", keyword);
    if (searchType !== "제목+내용") query.append("searchType", searchType);
    if (category !== "전체") query.append("category", category);
    query.append("page", "0");
    navigate(`/board?${query.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (newPage: number) => {
    const query = new URLSearchParams(location.search);
    query.set("page", newPage.toString());
    navigate(`/board?${query.toString()}`);
  };

  const handleCategoryChange = (newCategory: string) => {
    const query = new URLSearchParams(location.search);
    query.set("category", newCategory);
    query.set("page", "0");
    navigate(`/board?${query.toString()}`);
  };

  /** ✅ 전체 기준 ID 계산 */
  const calculateGlobalId = (boardId: number) => {
    const index = allBoards.findIndex((b) => b.id === boardId);
    if (index === -1) return 0;
    return totalElements - index;
  };

  return (
    <div className={`board-container ${loading ? "fade-out" : "fade-in"}`}>
      <h1 className="board-title">📋 게시판</h1>

      {/* ✅ 검색 바 */}
      <div className="board-search-bar">
        <select
          className="board-category-select"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="전체">전체</option>
          <option value="일반">일반</option>
          <option value="요청">요청</option>
          <option value="질문">질문</option>
        </select>

        {/* ✅ 검색 조건 - 제목+내용 기본, 제목 / 작성자 추가 */}
        <select
          className="board-search-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="제목+내용">제목 + 내용</option>
          <option value="제목">제목</option>
          <option value="작성자">작성자</option>
        </select>

        <input
          className="board-search-input"
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="board-search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {/* ✅ 게시글 테이블 */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>불러오는 중...</p>
      ) : errorMsg ? (
        <p style={{ textAlign: "center", color: "#999" }}>{errorMsg}</p>
      ) : (
        <BoardTable
          boards={boards.map((b) => ({
            id: b.id,
            displayId: calculateGlobalId(b.id),
            title: b.title,
            type: b.type,
            username: b.username,
            viewCount: b.viewCount,
          }))}
          onSelect={(id) => navigate(`/board/${id}`)}
        />
      )}

      {/* ✅ 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="board-button"
            onClick={() => handlePageChange(Math.max(page - 1, 0))}
            disabled={page === 0}
          >
            ← 이전
          </button>

          {[...Array(totalPages)].map((_, num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`page-number ${num === page ? "active" : ""}`}
            >
              {num + 1}
            </button>
          ))}

          <button
            className="board-button"
            onClick={() => handlePageChange(Math.min(page + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
          >
            다음 →
          </button>
        </div>
      )}

      {/* ✅ 글쓰기 버튼 */}
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate("/board/write")}
        >
          ✏️ 글쓰기
        </button>
      </div>
    </div>
  );
};

export default BoardList;
