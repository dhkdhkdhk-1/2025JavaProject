import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getBoardList, BoardResponse } from "../../api/BoardApi";
import { getMe, User } from "../../api/AuthApi";
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

  const [uiBoardType, setUiBoardType] = useState<"掲示板" | "告知">("掲示板");
  const [apiBoardType, setApiBoardType] = useState<"general" | "notice" | "">(
    ""
  );

  const [baseAll, setBaseAll] = useState<BoardResponse[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  /** ------------ 현재 로그인 사용자 정보 가져오기 -------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        setCurrentUser(me);
      } catch {
        setCurrentUser(null); // 비로그인
      }
    };
    fetchUser();
  }, []);

  /** ------------ URL → type 상태 반영 -------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type");

    if (typeParam === "notice") {
      setUiBoardType("告知");
      setApiBoardType("notice");
    } else {
      setUiBoardType("掲示板");
      setApiBoardType("general");
    }
  }, [location.search]);

  /** ------------ baseAll 불러오기 -------------- */
  const fetchBaseList = useCallback(async () => {
    if (apiBoardType === "") return;

    const res = await getBoardList(
      0,
      "",
      "タイトル+内容",
      "すべて",
      apiBoardType
    );

    let base = res.data.content
      .filter((b) => b.deleted !== true)
      .filter((b) =>
        apiBoardType === "notice"
          ? ["告知", "入荷", "行事"].includes(b.type)
          : ["一般", "リクエスト", "質問", "", null].includes(b.type)
      )
      .sort((a, b) => b.id - a.id)
      .map((b, idx, arr) => ({ ...b, displayId: arr.length - idx }));

    setBaseAll(base);
  }, [apiBoardType]);

  useEffect(() => {
    fetchBaseList();
  }, [fetchBaseList]);

  /** ------------ 게시글 목록 불러오기 -------------- */
  const fetchBoards = useCallback(
    async (pageNum: number, kw: string, st: string, ct: string) => {
      if (apiBoardType === "") return;

      try {
        setLoading(true);
        setErrorMsg("");

        const res = await getBoardList(0, kw, st, ct, apiBoardType);
        let list = res.data.content.filter((b) => b.deleted !== true);

        if (apiBoardType === "notice") {
          list = list.filter((b) => ["告知", "入荷", "行事"].includes(b.type));
        } else {
          list = list.filter((b) =>
            ["一般", "リクエスト", "質問", "", null].includes(b.type)
          );
        }

        if (ct !== "すべて") list = list.filter((b) => b.type === ct);

        if (kw.trim()) {
          const kwLower = kw.toLowerCase();
          list = list.filter(
            (b) =>
              (b.title || "").toLowerCase().includes(kwLower) ||
              (b.content || "").toLowerCase().includes(kwLower) ||
              (b.username || "").toLowerCase().includes(kwLower)
          );
        }

        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const numbered =
          !kw.trim() && ct === "すべて"
            ? baseAll
            : list.map((b) => {
                const found = baseAll.find((x) => x.id === b.id);
                return { ...b, displayId: found?.displayId ?? b.id };
              });

        const total = Math.ceil(numbered.length / 10);
        const paginated = numbered.slice(pageNum * 10, pageNum * 10 + 10);

        setBoards(paginated);
        setTotalPages(total);
      } catch (err) {
        console.error(err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          alert("ログインしてください。");
          navigate("/login");
        } else {
          setErrorMsg("❌ データ読み込みエラー");
        }
      } finally {
        setLoading(false);
      }
    },
    [apiBoardType, baseAll, navigate]
  );

  /** ------------ URL 변경 시 fetchBoards 실행 -------------- */
  useEffect(() => {
    if (apiBoardType === "") return;

    const params = new URLSearchParams(location.search);
    const kw = params.get("keyword") || "";
    const st = params.get("searchType") || "タイトル+内容";
    const ct = params.get("category") || "すべて";
    const pg = parseInt(params.get("page") || "0", 10);
    const refresh = params.get("refresh");

    setKeyword(kw);
    setSearchType(st);
    setCategory(ct);
    setPage(pg);

    if (refresh) {
      navigate(`/board?type=${apiBoardType}`);
      return;
    }

    fetchBoards(pg, kw, st, ct);
  }, [location.search, apiBoardType, fetchBoards, navigate]);

  /** ------------ 게시판 전환 -------------- */
  const handleBoardTypeChange = (uiType: "掲示板" | "告知") => {
    const apiType = uiType === "告知" ? "notice" : "general";
    setUiBoardType(uiType);
    setApiBoardType(apiType);
    navigate(`/board?type=${apiType}`);
  };

  /** ------------ 검색 -------------- */
  const handleSearch = () => {
    const q = new URLSearchParams();
    if (keyword.trim()) q.append("keyword", keyword);
    q.append("searchType", searchType);
    if (category !== "すべて") q.append("category", category);

    navigate(`/board?type=${apiBoardType}&${q.toString()}`);
    fetchBoards(0, keyword, searchType, category);
  };

  return (
    <div className="board-container">
      <h1 className="board-title">
        {uiBoardType === "掲示板" ? "掲示板" : "お知らせ"}
      </h1>

      <div className="board-category-toggle">
        <button
          onClick={() => handleBoardTypeChange("掲示板")}
          className={`general-button ${
            uiBoardType === "掲示板" ? "active" : ""
          }`}
        >
          掲示板
        </button>

        <button
          onClick={() => handleBoardTypeChange("告知")}
          className={`notice-button ${uiBoardType === "告知" ? "active" : ""}`}
        >
          お知らせ
        </button>
      </div>

      <div className="board-search-bar">
        <select
          className="board-category-select"
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);

            const q = new URLSearchParams();
            if (keyword.trim()) q.append("keyword", keyword);
            q.append("searchType", searchType);
            if (value !== "すべて") q.append("category", value);

            navigate(`/board?type=${apiBoardType}&${q.toString()}`);
          }}
        >
          {uiBoardType === "掲示板" ? (
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button className="board-search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {loading ? (
        <p className="fade-in" style={{ textAlign: "center" }}>
          読み込み中...
        </p>
      ) : errorMsg ? (
        <p style={{ textAlign: "center" }}>{errorMsg}</p>
      ) : (
        <BoardTable
          boards={boards}
          onSelect={(id) => navigate(`/board/${id}?type=${apiBoardType}`)}
        />
      )}

      {/* ------------ 글쓰기 버튼: 권한에 따라 노출 -------------- */}
      <div className="board-write-area">
        {/* 일반 게시판 → 로그인 유저 모두 가능 */}
        {apiBoardType === "general" && currentUser && (
          <button
            className="board-button"
            onClick={() => navigate(`/board/write?type=一般`)}
          >
            投稿する
          </button>
        )}

        {/* 공지 게시판 → 관리자 or 매니저만 */}
        {apiBoardType === "notice" &&
          currentUser &&
          (currentUser.role === "ADMIN" || currentUser.role === "MANAGER") && (
            <button
              className="board-button"
              onClick={() => navigate(`/board/write?type=告知`)}
            >
              お知らせ作成
            </button>
          )}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          className="board-button"
          disabled={page === 0}
          onClick={() =>
            navigate(`/board?type=${apiBoardType}&page=${page - 1}`)
          }
        >
          ⇠前へ
        </button>

        {Array.from(
          {
            length: Math.min(5, totalPages),
          },
          (_, i) => {
            const start = Math.max(0, page - 2);
            const pageNum = start + i;
            if (pageNum >= totalPages) return null;

            return (
              <button
                key={pageNum}
                className={`page-number ${pageNum === page ? "active" : ""}`}
                onClick={() =>
                  navigate(`/board?type=${apiBoardType}&page=${pageNum}`)
                }
              >
                {pageNum + 1}
              </button>
            );
          }
        )}

        <button
          className="board-button"
          disabled={page === totalPages - 1}
          onClick={() =>
            navigate(`/board?type=${apiBoardType}&page=${page + 1}`)
          }
        >
          次へ⇢
        </button>
      </div>
    </div>
  );
};

export default BoardList;
