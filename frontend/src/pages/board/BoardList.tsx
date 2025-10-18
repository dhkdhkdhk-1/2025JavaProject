import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getBoardList, BoardResponse } from "../../api/BoardApi";
import BoardTable from "./components/BoardTable";
import axios from "axios";
import "./board.css";

const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<BoardResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBoards = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true);
        const res = await getBoardList(pageNum);
        setBoards(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (error: unknown) {
        console.error("게시글 불러오기 실패:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    fetchBoards(page);
  }, [page, fetchBoards, navigate]);

  const getPageNumbers = () => {
    if (totalPages <= 1) return [0];
    const pages: number[] = [];
    const start = Math.max(0, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="board-container">
      <h1 className="board-title">📋 게시판</h1>
      {loading ? (
        <p style={{ textAlign: "center", color: "#777" }}>불러오는 중...</p>
      ) : (
        <BoardTable
          boards={boards.map((b) => ({
            id: b.id,
            title: b.title,
            type: b.type,
            username: b.username,
            viewCount: b.viewCount,
          }))}
          onSelect={(id) => navigate(`/board/${id}`)}
        />
      )}

      <div className="pagination">
        <button
          className="board-button"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          ← 이전
        </button>
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`page-number ${num === page ? "active" : ""}`}
          >
            {num + 1}
          </button>
        ))}
        {totalPages > 5 && page < totalPages - 3 && <span>…</span>}
        <button
          className="board-button"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
        >
          다음 →
        </button>
      </div>

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
