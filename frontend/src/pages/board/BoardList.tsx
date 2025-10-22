import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBoardList, BoardResponse } from "../../api/BoardApi";
import BoardTable from "./components/BoardTable";
import axios from "axios";
import "./board.css";

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [searchType, setSearchType] = useState("제목+내용");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("전체");
  const [boardType, setBoardType] = useState<"일반" | "공지">("일반");
  const userRole = localStorage.getItem("role") || "";

  const [baseAll, setBaseAll] = useState<BoardResponse[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  /** ✅ 전체 게시판 기준 목록 캐싱 */
  const fetchBaseList = useCallback(async () => {
    const res = await getBoardList(0, "", "제목+내용", "전체", boardType);
    let base = res.data.content
      .filter((b: BoardResponse) => b.deleted !== true)
      .filter((b: BoardResponse) =>
        boardType === "공지"
          ? ["공지", "입고", "행사"].includes(b.type || "")
          : !b.type || ["일반", "요청", "질문"].includes(b.type)
      )
      .sort((a: BoardResponse, b: BoardResponse) => b.id - a.id)
      .map((b: BoardResponse, idx: number, arr: BoardResponse[]) => ({
        ...b,
        displayId: arr.length - idx,
      }));
    setBaseAll(base);
  }, [boardType]);

  /** ✅ 게시글 목록 불러오기 */
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
          0,
          keywordStr,
          searchTypeStr,
          categoryStr,
          boardType
        );

        let allBoards = res.data.content || [];
        allBoards = allBoards.filter((b) => b.deleted !== true);

        let filtered: BoardResponse[] = [];
        if (boardType === "공지") {
          filtered = allBoards.filter((b) =>
            ["공지", "입고", "행사"].includes(b.type || "")
          );
        } else {
          filtered = allBoards.filter(
            (b) => !b.type || ["일반", "요청", "질문"].includes(b.type)
          );
        }

        if (categoryStr !== "전체") {
          filtered = filtered.filter((b) => b.type === categoryStr);
        }

        if (keywordStr.trim()) {
          const kw = keywordStr.toLowerCase();
          filtered = filtered.filter((b) => {
            if (searchTypeStr === "제목")
              return b.title.toLowerCase().includes(kw);
            if (searchTypeStr === "작성자")
              return b.username.toLowerCase().includes(kw);
            return (
              b.title.toLowerCase().includes(kw) ||
              b.content.toLowerCase().includes(kw)
            );
          });
        }

        filtered.sort((a, b) => b.id - a.id);

        let numbered: BoardResponse[];
        const isDefaultView = !keywordStr.trim() && categoryStr === "전체";

        if (isDefaultView) {
          numbered = baseAll;
        } else {
          numbered = filtered.map((b) => {
            const found = baseAll.find((x) => x.id === b.id);
            return {
              ...b,
              displayId: found ? found.displayId : b.id,
            };
          });
        }

        const totalPageCount = Math.ceil(numbered.length / 10);
        const startIdx = pageNum * 10;
        const paginated = numbered.slice(startIdx, startIdx + 10);

        setBoards(paginated);
        setTotalPages(totalPageCount);
      } catch (error) {
        console.error("❌ 게시글 불러오기 실패:", error);
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
    [navigate, boardType, baseAll]
  );

  useEffect(() => {
    fetchBaseList();
  }, [fetchBaseList]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSearchType = params.get("searchType") || "제목+내용";
    const newKeyword = params.get("keyword") || "";
    const newCategory = params.get("category") || "전체";
    const newPage = parseInt(params.get("page") || "0", 10);
    const refresh = params.get("refresh");

    setSearchType(newSearchType);
    setKeyword(newKeyword);
    setCategory(newCategory);
    setPage(newPage);

    fetchBoards(newPage, newKeyword, newSearchType, newCategory);
    if (refresh) navigate("/board");
  }, [location.search, boardType, fetchBoards, navigate]);

  const handleBoardTypeChange = (type: "일반" | "공지") => {
    setBoardType(type);
    setCategory("전체");
    setPage(0);
    navigate(`/board?type=${type}`);
  };

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
    const query = new URLSearchParams();
    if (keyword.trim()) query.append("keyword", keyword);
    if (searchType !== "제목+내용") query.append("searchType", searchType);
    if (category !== "전체") query.append("category", category);
    query.append("page", newPage.toString());
    navigate(`/board?${query.toString()}`);
  };

  return (
    <div className={`board-container ${loading ? "fade-out" : "fade-in"}`}>
      <h1 className="board-title">
        {boardType === "일반" ? "게시판" : "공지게시판"}
      </h1>

      <div className="board-category-toggle">
        <button
          onClick={() => handleBoardTypeChange("일반")}
          className={`general-button ${boardType === "일반" ? "active" : ""}`}
        >
          일반 게시판
        </button>
        <button
          onClick={() => handleBoardTypeChange("공지")}
          className={`notice-button ${boardType === "공지" ? "active" : ""}`}
        >
          공지 게시판
        </button>
      </div>

      <div className="board-search-bar">
        <select
          className="board-category-select"
          value={category}
          onChange={(e) => {
            const newCategory = e.target.value;
            setCategory(newCategory);
            const query = new URLSearchParams();
            if (keyword.trim()) query.append("keyword", keyword);
            if (searchType !== "제목+내용")
              query.append("searchType", searchType);
            if (newCategory !== "전체") query.append("category", newCategory);
            query.append("page", "0");
            navigate(`/board?${query.toString()}`);
          }}
        >
          {boardType === "일반" ? (
            <>
              <option value="전체">전체</option>
              <option value="일반">일반</option>
              <option value="요청">요청</option>
              <option value="질문">질문</option>
            </>
          ) : (
            <>
              <option value="전체">전체</option>
              <option value="공지">공지</option>
              <option value="입고">입고</option>
              <option value="행사">행사</option>
            </>
          )}
        </select>

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

      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>불러오는 중...</p>
      ) : errorMsg ? (
        <p style={{ textAlign: "center", color: "#999" }}>{errorMsg}</p>
      ) : (
        <BoardTable
          boards={boards}
          onSelect={(id) => navigate(`/board/${id}`)}
        />
      )}

      <div className="pagination">
        <button
          className="board-button"
          onClick={() => handlePageChange(Math.max(page - 1, 0))}
          disabled={page === 0}
        >
          ← 이전
        </button>

        {[...Array(Math.max(totalPages, 1))].map((_, num) => (
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
          onClick={() =>
            handlePageChange(Math.min(page + 1, Math.max(totalPages - 1, 0)))
          }
          disabled={page >= totalPages - 1 || totalPages === 0}
        >
          다음 →
        </button>
      </div>

      {/* ✅ 글쓰기 버튼 */}
      {userRole &&
        (boardType === "일반"
          ? (userRole === "USER" ||
              userRole === "MANAGER" ||
              userRole === "ADMIN") && (
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  className="board-button"
                  onClick={() => navigate("/board/write")}
                >
                  ✏️ 글쓰기
                </button>
              </div>
            )
          : (userRole === "MANAGER" || userRole === "ADMIN") && (
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  className="board-button"
                  onClick={() => navigate("/board/notice/write?redirect=공지")}
                >
                  ✏️ 공지 작성
                </button>
              </div>
            ))}
    </div>
  );
};

export default BoardList;
