import React, { useEffect, useState } from "react";
import {
  getBranches,
  addBranch,
  updateBranch,
  deleteBranch,
  BranchResponse,
  BranchRequest,
  PageResponse,
} from "../../../api/BranchApi";
import BranchModal from "../../../components/modal/branchmodal/BranchModal";
import "./Branches.css";

const Branches: React.FC = () => {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchResponse | null>(
    null
  );
  const [showModal, setShowModal] = useState<
    "add" | "edit" | "view" | null
  >(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  /** ✅ 목록 조회 */
  const fetchBranches = async (pageNum = 0) => {
    try {
      const res: PageResponse<BranchResponse> = await getBranches(pageNum, 10);
      setBranches(res.content || []);
      setTotalPages(res.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("❌ 支店一覧の取得に失敗しました:", err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  /** ✅ 추가 */
  const handleAdd = async (form: BranchRequest) => {
    try {
      await addBranch(form);
      fetchBranches(page);
      setShowModal(null);
    } catch (err) {
      console.error("❌ 支店登録に失敗しました:", err);
    }
  };

  /** ✅ 수정 */
  const handleUpdate = async (form: BranchRequest) => {
    try {
      await updateBranch(form);
      fetchBranches(page);
      setShowModal(null);
    } catch (err) {
      console.error("❌ 支店情報の修正に失敗しました:", err);
    }
  };

  /** ✅ 삭제 */
  const handleDelete = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await deleteBranch(id);
      fetchBranches(page);
    } catch (err) {
      console.error("❌ 支店削除に失敗しました:", err);
    }
  };

  /** ✅ 페이지 이동 */
  const handlePrev = () => page > 0 && fetchBranches(page - 1);
  const handleNext = () => page < totalPages - 1 && fetchBranches(page + 1);

  /** ✅ 검색 필터 */
  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="branch-container">
      {/* ===== 헤더 ===== */}
      <div className="branch-header">
        <h2>支店管理</h2>
        <div className="branch-actions">
          <button className="add-btn" onClick={() => setShowModal("add")}>
            + 支店を追加
          </button>
          <input
            type="text"
            placeholder="名前で検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ===== 테이블 ===== */}
      <table className="branch-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>支店名</th>
            <th>住所</th>
            <th style={{ textAlign: "center" }}>管理者</th>
            <th style={{ textAlign: "center" }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredBranches.length > 0 ? (
            filteredBranches.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.location}</td>

                {/* 👁️ → 管理者 */}
                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn view"
                    onClick={() => {
                      setSelectedBranch(b);
                      setShowModal("view");
                    }}
                    title="表示"
                  >
                    👁️
                  </button>
                </td>

                {/* ✏️ 🗑️ → 操作 */}
                <td className="action-buttons">
                  <button
                    className="icon-btn edit"
                    onClick={() => {
                      setSelectedBranch(b);
                      setShowModal("edit");
                    }}
                    title="編集"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(b.id)}
                    title="削除"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                データがありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== 페이지네이션 ===== */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ 前へ
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          次へ ▶
        </button>
      </div>

      {/* ===== 모달 ===== */}
      {showModal && (
        <BranchModal
          mode={showModal}
          branch={selectedBranch}
          onClose={() => setShowModal(null)}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Branches;
