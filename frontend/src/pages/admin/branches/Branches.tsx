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
    "add" | "edit" | "view" | "delete" | null
  >(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  /** ✅ 목록 조회 */
  const fetchBranches = async (pageNum = 0) => {
    try {
      const res: PageResponse<BranchResponse> = await getBranches(pageNum, 5);
      setBranches(res.content || []);
      setTotalPages(res.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("❌ 지점 목록 조회 실패:", err);
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
      console.error("❌ 지점 등록 실패:", err);
    }
  };

  /** ✅ 수정 */
  const handleUpdate = async (form: BranchRequest) => {
    try {
      await updateBranch(form);
      fetchBranches(page);
      setShowModal(null);
    } catch (err) {
      console.error("❌ 지점 수정 실패:", err);
    }
  };

  /** ✅ 삭제 */
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteBranch(id);
      fetchBranches(page);
    } catch (err) {
      console.error("❌ 지점 삭제 실패:", err);
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
      {/* 헤더 */}
      <div className="branch-header">
        <h2>지점 관리</h2>
        <div className="branch-actions">
          <button className="add-btn" onClick={() => setShowModal("add")}>
            + Add Branch
          </button>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 테이블 */}
      <table className="branch-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>지점명</th>
            <th>주소</th>
            <th>관리자</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBranches.length > 0 ? (
            filteredBranches.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.address}</td>
                <td>{b.managerName}</td>
                <td className="action-buttons">
                  <button
                    className="icon-btn view"
                    onClick={() => {
                      setSelectedBranch(b);
                      setShowModal("view");
                    }}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    className="icon-btn edit"
                    onClick={() => {
                      setSelectedBranch(b);
                      setShowModal("edit");
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(b.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ 이전
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          다음 ▶
        </button>
      </div>

      {/* 모달 */}
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
