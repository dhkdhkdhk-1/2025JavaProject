import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCsList,
  CsUserListResponse,
  CsStatus,
  CsCategory,
} from "../../../api/CsApi";
import "./MyCsListPage.css";

// ✅ 카테고리 한글 변환
const getCategoryLabel = (category: CsCategory): string => {
  switch (category) {
    case CsCategory.BOOK:
      return "書籍関連";
    case CsCategory.ACCOUNT:
      return "アカウント関連";
    case CsCategory.ETC:
      return "その他";
    default:
      return category;
  }
};

// ✅ 상태 한글 변환
const getStatusLabel = (status: CsStatus): string => {
  switch (status) {
    case CsStatus.WAITING:
      return "回答待ち";
    case CsStatus.COMPLETED:
      return "回答完了";
    default:
      return status;
  }
};

const MyCsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [csList, setCsList] = useState<CsUserListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
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

        const response = await getMyCsList(currentPage, pageSize);
        setCsList(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (err: any) {
        console.error("お問い合わせリスト読み込みに失敗しました。:", err);
        if (err.response?.status === 401) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
        } else {
          setError("お問い合わせリストの読み込みに失敗しました。");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCsList();
  }, [currentPage, navigate]);

  // ✅ 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="layout-wrapper">
        <div className="layout-main">
          <div className="cslist-container">
            <div style={{ textAlign: "center", padding: "50px" }}>
              読み込み中...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout-wrapper">
        <div className="layout-main">
          <div className="cslist-container">
            <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-wrapper">
      <div className="layout-main">
        <div className="cslist-container">
          <h1 className="cslist-title">📨 お問い合わせ履歴</h1>

          {/* ✅ 테이블 전체를 감싸는 wrapper */}
          <div className="cslist-wrapper">
            <table className="cslist-table">
              <thead>
                <tr>
                  <th>番号</th>
                  <th>タイトル</th>
                  <th>分類</th>
                  <th>状態</th>
                  <th>作成日</th>
                </tr>
              </thead>

              <tbody>
                {csList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "#999",
                        height: "200px",
                      }}
                    >
                      登録されたお問い合わせはありません。
                    </td>
                  </tr>
                ) : (
                  csList.map((c, index) => (
                    <tr
                      key={c.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/cs/detail/${c.id}`)}
                    >
                      <td>
                        {totalElements - (currentPage * pageSize + index)}
                      </td>

                      <td className="title-cell">{c.title}</td>
                      <td>{getCategoryLabel(c.csCategory)}</td>
                      <td
                        style={{
                          color:
                            c.csStatus === CsStatus.WAITING
                              ? "orange"
                              : "green",
                          fontWeight: 600,
                        }}
                      >
                        {getStatusLabel(c.csStatus)}
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ 페이지네이션 */}
          {totalPages > 1 && (
            <div
              className="pagination"
              style={{ marginTop: "20px", justifyContent: "center" }}
            >
              <button
                className="cslist-button"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
                style={{ marginRight: "10px" }}
              >
                最初
              </button>
              <button
                className="cslist-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                style={{ marginRight: "10px" }}
              >
                前へ
              </button>
              <span style={{ margin: "0 15px", lineHeight: "35px" }}>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                className="cslist-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                style={{ marginLeft: "10px" }}
              >
                次へ
              </button>
              <button
                className="cslist-button"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
                style={{ marginLeft: "10px" }}
              >
                最後
              </button>
            </div>
          )}

          {/* ✅ 버튼은 테이블 아래 오른쪽 정렬 */}
          <div className="cslist-footer">
            <button
              className="cslist-button"
              onClick={() => navigate("/writecs")}
            >
              ✏️ お問い合わせ作成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCsListPage;
