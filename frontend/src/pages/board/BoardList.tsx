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
  const userRole = localStorage.getItem("role") || "";

  const [baseAll, setBaseAll] = useState<BoardResponse[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  /** ✅ 전체 게시판 기준 목록 캐싱 */
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

        // ✅ 게시판 타입 필터링
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

        // ✅ 카테고리 필터
        if (categoryStr !== "すべて") {
          filtered = filtered.filter((b) => b.type === categoryStr);
        }

        // ✅ 키워드 검색 로직
        if (keywordStr.trim()) {
          const kw = keywordStr.trim().toLowerCase();

          filtered = filtered.filter((b) => {
            const title = (b.title || "").toLowerCase();
            const content = (b.content || "").toLowerCase();
            const username = (b.username || "").trim().toLowerCase();

            if (searchTypeStr === "タイトル") {
              return title.includes(kw);
            }

            if (searchTypeStr === "投稿者") {
              // ✅ null-safe + 완전 일치 + 부분 일치
              return (
                username !== "" && (username === kw || username.includes(kw))
              );
            }

            // ✅ "タイトル+内容"
            return title.includes(kw) || content.includes(kw);
          });
        }

        // ✅ createdAt 기준 정렬 (첫 글 누락 방지)
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // 최신순
        });

        // ✅ displayId 유지
        let numbered: BoardResponse[];
        const isDefaultView = !keywordStr.trim() && categoryStr === "すべて";

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

        // ✅ 페이지 계산
        const totalPageCount = Math.ceil(numbered.length / 10);
        const startIdx = pageNum * 10;
        const paginated = numbered.slice(startIdx, startIdx + 10);

        setBoards(paginated);
        setTotalPages(totalPageCount);
      } catch (error) {
        console.error("❌ 投稿読み込みに失敗しました。:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          alert(
            "セッションの有効期限が切れました。もう一度ログインしてください。"
          );
          navigate("/login");
        } else {
          setErrorMsg("❌ データの読み込み中エラーが発生しました。");
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

    setSearchType(newSearchType);
    setKeyword(newKeyword);
    setCategory(newCategory);
    setPage(newPage);

    fetchBoards(newPage, newKeyword, newSearchType, newCategory);
    if (refresh) navigate("/board");
  }, [location.search, boardType, fetchBoards, navigate]);

  const handleBoardTypeChange = (type: "掲示板" | "告知") => {
    setBoardType(type);
    setCategory("すべて");
    setPage(0);
    navigate(`/board?type=${type}`);
  };

  /** ✅ searchType 즉시 반영 + fetchBoards 직접 호출 */
  const handleSearch = () => {
    const query = new URLSearchParams();
    if (keyword.trim()) query.append("keyword", keyword);
    query.append("searchType", searchType);
    if (category !== "すべて") query.append("category", category);
    query.append("page", "0");

    navigate(`/board?${query.toString()}`);

    // 🔥 즉시 실행 (URL 업데이트 기다리지 않음)
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
    navigate(`/board?${query.toString()}`);
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
            navigate(`/board?${query.toString()}`);
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
          onSelect={(id) => navigate(`/board/${id}`)}
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
          次へ →
        </button>
      </div>

      {/* ✅ 글쓰기 버튼 */}
      {userRole &&
        (boardType === "掲示板"
          ? (userRole === "USER" ||
              userRole === "MANAGER" ||
              userRole === "ADMIN") && (
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  className="board-button"
                  onClick={() => navigate("/board/write")}
                >
                  ✏️ 投稿する
                </button>
              </div>
            )
          : (userRole === "MANAGER" || userRole === "ADMIN") && (
              <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                  className="board-button"
                  onClick={() => navigate("/board/notice/write?redirect=告知")}
                >
                  ✏️ 告知作成
                </button>
              </div>
            ))}
    </div>
  );
};

export default BoardList;
