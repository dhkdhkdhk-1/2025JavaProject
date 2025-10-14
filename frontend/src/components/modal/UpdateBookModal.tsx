import React, { useState, useEffect } from "react";
import Modal from "./Modal";

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
  const [form, setForm] = useState(book || {});

  useEffect(() => {
    setForm(book || {});
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Update Book" onClose={onClose}>
      <input
        name="title"
        placeholder="제목"
        value={form.title || ""}
        onChange={handleChange}
      />
      <input
        name="author"
        placeholder="저자"
        value={form.author || ""}
        onChange={handleChange}
      />
      <input
        name="publisher"
        placeholder="출판사"
        value={form.publisher || ""}
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
          UPDATE
        </button>
      </div>
    </Modal>
  );
};

export default UpdateBookModal;
