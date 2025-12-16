import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { getBranches } from "../../../api/BranchApi";
import "./UpdateBookModal.css";

interface Branch {
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  book: any;
  onUpdate: (updatedBook: any) => void;
  onClose: () => void;
}

const UpdateBookModal: React.FC<Props> = ({
  isOpen,
  book,
  onUpdate,
  onClose,
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Branch[]>([]);

  const [form, setForm] = useState<any>({
    id: null,
    title: "",
    author: "",
    publisher: "",
    category: "",
  });

  /** 초기 데이터 */
  useEffect(() => {
    if (!book) return;

    setForm({
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      category: book.category,
    });

    if (book.branches) {
      setSelected(book.branches);
    }
  }, [book]);

  /** 지점 로딩 */
  useEffect(() => {
    if (!isOpen) return;

    getBranches(0, 500).then((res) => {
      setBranches(res.content);
    });
  }, [isOpen]);

  const filtered = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      String(b.id).includes(search)
  );

  const addBranch = (branch: Branch) => {
    if (selected.find((b) => b.id === branch.id)) return;
    setSelected([...selected, branch]);
    setSearch("");
  };

  const removeBranch = (id: number) => {
    setSelected(selected.filter((b) => b.id !== id));
  };

  const handleSubmit = () => {
    onUpdate({
      ...form,
      branchIds: selected.map((b) => b.id),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Update Book" onClose={onClose}>
      {/* 📌 기본 정보 */}
      <div className="form-section">
        <input
          placeholder="제목"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="저자"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          placeholder="출판사"
          value={form.publisher}
          onChange={(e) => setForm({ ...form, publisher: e.target.value })}
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">카테고리 선택</option>
          <option value="NOVEL">소설</option>
          <option value="ESSAY">에세이</option>
          <option value="IT">IT</option>
          <option value="HISTORY">역사</option>
          <option value="SCIENCE">과학</option>
          <option value="OTHER">기타</option>
        </select>
      </div>

      {/* 📌 지점 선택 */}
      <div className="branch-section">
        <label className="section-label">등록 지점</label>

        <div className="branch-search">
          <input
            placeholder="지점명 또는 ID 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <div className="branch-dropdown">
              {filtered.slice(0, 8).map((b) => (
                <div
                  key={b.id}
                  className="branch-item"
                  onClick={() => addBranch(b)}
                >
                  {b.name} (ID: {b.id})
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="branch-empty">검색 결과 없음</div>
              )}
            </div>
          )}
        </div>

        <div className="selected-branches">
          {selected.map((b) => (
            <span key={b.id} className="branch-chip">
              {b.name}
              <button onClick={() => removeBranch(b.id)}>✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* 📌 버튼 */}
      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onClose}>
          CANCEL
        </button>
        <button className="modal-btn confirm" onClick={handleSubmit}>
          UPDATE
        </button>
      </div>
    </Modal>
  );
};

export default UpdateBookModal;
