import React, { useState } from "react";
import Modal from "../Modal";
import type { BookForm } from "../../../api/BookApi";
import BranchSelectModal from "./BranchSelectModal";

interface AddBookModalProps {
  isOpen: boolean;
  onAdd: (form: BookForm, file?: File | null) => void;
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onAdd,
  onClose,
}) => {
  const [form, setForm] = useState<BookForm>({
    title: "",
    author: "",
    publisher: "",
    category: "",
    available: true,
    branchIds: [],
    imageUrl: null,
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload: BookForm = {
      ...form,
      category: form.category || "OTHER",
    };
    onAdd(payload, imageFile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="Add Book" onClose={onClose}>
      <input
        name="title"
        placeholder="タイトル"
        value={form.title}
        onChange={handleTextChange}
      />
      <input
        name="author"
        placeholder="著者"
        value={form.author}
        onChange={handleTextChange}
      />
      <input
        name="publisher"
        placeholder="出版社"
        value={form.publisher}
        onChange={handleTextChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      <select name="category" value={form.category} onChange={handleTextChange}>
        <option value="">カテゴリー選択</option>
        <option value="NOVEL">小説</option>
        <option value="ESSAY">エッセイ</option>
        <option value="IT">IT</option>
        <option value="HISTORY">歴史</option>
        <option value="SCIENCE">科学</option>
        <option value="OTHER">その他</option>
      </select>
      <hr/>

      <button type="button" onClick={() => setBranchModalOpen(true)}>
        支店選択 ({form.branchIds.length}個)
      </button>

      <BranchSelectModal
        isOpen={branchModalOpen}
        selectedIds={form.branchIds}
        onConfirm={(ids) => setForm((prev) => ({ ...prev, branchIds: ids }))}
        onClose={() => setBranchModalOpen(false)}
      />

      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onClose}>
          キャンセル
        </button>
        <button
          className="modal-btn confirm"
          onClick={handleSubmit}
          disabled={form.branchIds.length === 0}
        >
          追加
        </button>
      </div>
    </Modal>
  );
};

export default AddBookModal;
