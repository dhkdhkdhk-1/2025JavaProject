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

  const [searchType, setSearchType] = useState("タイトル+内容");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("すべて");
  const [boardType, setBoardType] = useState<"掲示板" | "告知">("掲示板");

  const [baseAll, setBaseAll] = useState<BoardResponse[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  /** 📌 URL의 type 값 반영해서 현재 게시판 타입 자동 설정 */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");
    if (typeParam === "告知") setBoardType("告知");
    else setBoardType("掲示板");
  }, [location.search]);

  /** 전체 게시판 기준 목록 캐싱 */
  const fetchBaseList = useCallback(async () => {
    const res = await getBoardList(0, "", "タイトル+内容", "すべて", boardType);
    let base = res.data.content
      .filter((b: BoardResponse) => b.deleted !== true)
      .filter((b: BoardResponse) =>
        boardType === "告知"
          ? ["告知", "入荷", "行事"].includes(b.type || "")
          : !b.type || ["一般", "リクエスト", "質問"].includes(b.type)
      )
      .sort((a: BoardResponse, b: BoardResponse) => b.id - a.id)
      .map((b: BoardResponse, idx: number, arr: BoardResponse[]) => ({
        ...b,
        displayId: arr.length - idx,
      }));
    setBaseAll(base);
  }, [boardType]);

  /** 게시글 목록 불러오기 */
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
        if (boardType === "告知") {
          filtered = allBoards.filter((b) =>
            ["告知", "入荷", "行事"].includes(b.type || "")
          );
        } else {
          filtered = allBoards.filter(
            (b) => !b.type || ["一般", "リクエスト", "質問"].includes(b.type)
          );
        }

        if (categoryStr !== "すべて") {
          filtered = filtered.filter((b) => b.type === categoryStr);
        }

        if (keywordStr.trim()) {
          const kw = keywordStr.trim().toLowerCase();

          filtered = filtered.filter((b) => {
            const title = (b.title || "").toLowerCase();
            const content = (b.content || "").toLowerCase();
            const username = (b.username || "").trim().toLowerCase();

            if (searchTypeStr === "タイトル") return title.includes(kw);
            if (searchTypeStr === "投稿者") return username.includes(kw);
            return title.includes(kw) || content.includes(kw);
          });
        }

        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        let numbered: BoardResponse[];
        const isDefaultView = !keywordStr.trim() && categoryStr === "すべて";

        if (isDefaultView) {
          numbered = baseAll;
        } else {
          numbered = filtered.map((b) => {
            const found = baseAll.find((x) => x.id === b.id);
            return { ...b, displayId: found ? found.displayId : b.id };
          });
        }

        const totalPageCount = Math.ceil(numbered.length / 10);
        const startIdx = pageNum * 10;
        const paginated = numbered.slice(startIdx, startIdx + 10);

        setBoards(paginated);
        setTotalPages(totalPageCount);
      } catch (error) {
        console.error("❌ 投稿読み込み失敗:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          alert("ログインしてください。");
          navigate("/login");
        } else {
          setErrorMsg("❌ データ読み込みエラー");
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
    const newSearchType = params.get("searchType") || "タイトル+内容";
    const newKeyword = params.get("keyword") || "";
    const newCategory = params.get("category") || "すべて";
    const newPage = parseInt(params.get("page") || "0", 10);
    const refresh = params.get("refresh");
    const typeParam = params.get("type");

    setSearchType(newSearchType);
    setKeyword(newKeyword);
    setCategory(newCategory);
    setPage(newPage);

    // 🔵 추가된 부분 1
    if (typeParam === "告知" && boardType !== "告知") return;

    // 🔵 추가된 부분 2
    if (typeParam !== "告知" && boardType !== "掲示板") return;

    fetchBoards(newPage, newKeyword, newSearchType, newCategory);

    if (refresh) navigate(`/board?type=${boardType}`);
  }, [location.search, boardType, fetchBoards, navigate]);

  const handleBoardTypeChange = (type: "掲示板" | "告知") => {
    setBoardType(type);
    setCategory("すべて");
    setPage(0);
    navigate(`/board?type=${type}`);
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (keyword.trim()) query.append("keyword", keyword);
    query.append("searchType", searchType);
    if (category !== "すべて") query.append("category", category);
    query.append("page", "0");

    navigate(`/board?type=${boardType}&${query.toString()}`);
    fetchBoards(0, keyword, searchType, category);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handlePageChange = (newPage: number) => {
    const query = new URLSearchParams();
    if (keyword.trim()) query.append("keyword", keyword);
    query.append("searchType", searchType);
    if (category !== "すべて") query.append("category", category);
    query.append("page", newPage.toString());

    navigate(`/board?type=${boardType}&${query.toString()}`);
  };

  return (
    <div className={`board-container ${loading ? "fade-out" : "fade-in"}`}>
      <h1 className="board-title">
        {boardType === "掲示板" ? "掲示板" : "お知らせ"}
      </h1>

      <div className="board-category-toggle">
        <button
          onClick={() => handleBoardTypeChange("掲示板")}
          className={`general-button ${boardType === "掲示板" ? "active" : ""}`}
        >
          掲示板
        </button>
        <button
          onClick={() => handleBoardTypeChange("告知")}
          className={`notice-button ${boardType === "告知" ? "active" : ""}`}
        >
          お知らせ
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
            query.append("searchType", searchType);
            if (newCategory !== "すべて") query.append("category", newCategory);
            query.append("page", "0");

            navigate(`/board?type=${boardType}&${query.toString()}`);
          }}
        >
          {boardType === "掲示板" ? (
            <>
              <option value="すべて">すべて</option>
              <option value="一般">一般</option>
              <option value="リクエスト">リクエスト</option>
              <option value="質問">質問</option>
            </>
          ) : (
            <>
              <option value="すべて">すべて</option>
              <option value="告知">告知</option>
              <option value="入荷">入荷</option>
              <option value="行事">行事</option>
            </>
          )}
        </select>

        <select
          className="board-search-select"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="タイトル+内容">タイトル＋内容</option>
          <option value="タイトル">タイトル</option>
          <option value="投稿者">投稿者</option>
        </select>

        <input
          className="board-search-input"
          type="text"
          placeholder="キーワード"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button className="board-search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>読み込み中...</p>
      ) : errorMsg ? (
        <p style={{ textAlign: "center", color: "#999" }}>{errorMsg}</p>
      ) : (
        <BoardTable
          boards={boards}
          /** ⭐ 여기 수정됨! 타입을 함께 넘겨주기 */
          onSelect={(id) => navigate(`/board/${id}?type=${boardType}`)}
        />
      )}

      <div className="pagination">
        <button
          className="board-button"
          onClick={() => handlePageChange(Math.max(page - 1, 0))}
          disabled={page === 0}
        >
          ← 前へ
        </button>

        {[...Array(Math.max(totalPages, 1))].map((_, num) => (
          <button
            key={num}
            className={`page-number ${num === page ? "active" : ""}`}
            onClick={() => handlePageChange(num)}
          >
            {num + 1}
          </button>
        ))}

        <button
          className="board-button"
          onClick={() => handlePageChange(Math.min(page + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          次へ →
        </button>
      </div>
    </div>
  );
};

export default BoardList;
