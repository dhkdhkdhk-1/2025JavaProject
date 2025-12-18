// src/pages/cspage/admincs/AdminCsManager.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../board/board.css";
import {
  getAdminCsList,
  CsAdminListResponse,
  CsStatus,
} from "../../../api/CsApi";

// ✅ 상태 한글 변환
const getStatusLabel = (status: CsStatus): string => {
  switch (status) {
    case CsStatus.WAITING:
      return "対応待ち";
    case CsStatus.COMPLETED:
      return "完了";
    default:
      return status;
  }
};

const AdminCsManager: React.FC = () => {
  const navigate = useNavigate();
  const [csList, setCsList] = useState<CsAdminListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // ✅ 문의 목록 로딩
  useEffect(() => {
    const loadCsList = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
          return;
        }

        const res = await getAdminCsList(currentPage, pageSize);
        setCsList(res.content);
        setTotalPages(res.totalPages);
      } catch (err: any) {
        console.error("問い合わせリストロード失敗:", err);
        if (err.response?.status === 401) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
        } else if (err.response?.status === 403) {
          setError("CS管理一覧へのアクセス権限がありません。");
        } else {
          setError("お問い合わせリストの読み込みに失敗しました。");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCsList();
  }, [currentPage, navigate]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="board-container">
      <h1 className="board-title">📨 お問い合わせ管理</h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>読み込み中...</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
          {error}
        </div>
      ) : (
        <>
          <table className="board-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>件名</th>
                <th>作成者</th>
                <th>支店</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {csList.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td style={{ textAlign: "left" }}>{c.title}</td>
                  <td>{c.username}</td>
                  <td>{c.branchName}</td>
                  <td
                    style={{
                      color:
                        c.csStatus === CsStatus.WAITING ? "orange" : "green",
                      fontWeight: 600,
                    }}
                  >
                    {getStatusLabel(c.csStatus)}
                  </td>
                  <td>
                    <button
                      className="board-button"
                      onClick={() => navigate(`/admin/answerwrite/${c.id}`)}
                      style={{ padding: "6px 10px" }}
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination" style={{ marginTop: "20px" }}>
              <button
                className="page-number"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
              >
                前へ
              </button>
              <button
                className="page-number"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                ‹
              </button>
              <span style={{ padding: "0 10px" }}>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                className="page-number"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                ›
              </button>
              <button
                className="page-number"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCsManager;
