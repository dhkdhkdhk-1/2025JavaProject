import React, { useState } from "react";
import Modal from "../Modal";

export interface AddBookModalProps {
  isOpen: boolean;
  onAdd: (book: any) => void;
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onAdd,
  onClose,
}) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    category: "",
    branchId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "branchId" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleSubmit = () => {
    onAdd(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Add Book" onClose={onClose}>
      <input
        name="title"
        placeholder="제목"
        value={form.title}
        onChange={handleChange}
      />
      <input
        name="author"
        placeholder="저자"
        value={form.author}
        onChange={handleChange}
      />
      <input
        name="publisher"
        placeholder="출판사"
        value={form.publisher}
        onChange={handleChange}
      />
      <input
        name="branchId"
        type="number"
        placeholder="지점 ID (예: 1)"
        value={form.branchId}
        onChange={handleChange}
      />
      <select
        name="category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="">카테고리 선택</option>
        <option value="NOVEL">소설</option>
        <option value="ESSAY">에세이</option>
        <option value="IT">IT / 프로그래밍</option>
        <option value="HISTORY">역사</option>
        <option value="SCIENCE">과학</option>
        <option value="OTHER">기타</option>
      </select>

      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onClose}>
          CANCEL
        </button>
        <button className="modal-btn confirm" onClick={handleSubmit}>
          ADD
        </button>
      </div>
    </Modal>
  );
};

export default AddBookModal;
