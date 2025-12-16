import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { getBranches } from "../../../api/BranchApi";
import "./BookModal.css";

interface Branch {
  id: number;
  name: string;
}

interface Props {
  isOpen: boolean;
  onAdd: (book: any) => void;
  onClose: () => void;
}

const AddBookModal: React.FC<Props> = ({ isOpen, onAdd, onClose }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selected, setSelected] = useState<Branch[]>([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    category: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    getBranches(0, 200).then((res) => setBranches(res.content));
    setSelected([]);
  }, [isOpen]);

  const addBranch = (b: Branch) => {
    if (selected.find((s) => s.id === b.id)) return;
    setSelected([...selected, b]);
  };

  const removeBranch = (id: number) => {
    setSelected(selected.filter((b) => b.id !== id));
  };

  const handleSubmit = () => {
    onAdd({
      ...form,
      branchIds: selected.map((b) => b.id),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Add Book" onClose={onClose}>
      <div className="modal-body">
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

        {/* 지점 선택 */}
        <select onChange={(e) => {
          const b = branches.find(x => x.id === Number(e.target.value));
          if (b) addBranch(b);
        }}>
          <option value="">지점 추가</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* 선택된 지점 태그 */}
        <div className="branch-tag-container">
          {selected.map((b) => (
            <div key={b.id} className="branch-tag">
              {b.name}
              <button onClick={() => removeBranch(b.id)}>×</button>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            CANCEL
          </button>
          <button
            className="modal-btn confirm"
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            ADD
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddBookModal;
