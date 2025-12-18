import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import type { BookForm, Book } from "../../../api/BookApi";
import BranchSelectModal from "./BranchSelectModal";

interface Props {
  isOpen: boolean;
  book: Book | null;
  onUpdate: (id: number, form: BookForm, file?: File | null) => void;
  onClose: () => void;
}

const UpdateBookModal: React.FC<Props> = ({
  isOpen,
  book,
  onUpdate,
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

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        category: book.category,
        available: book.available,
        branchIds: book.branchIds ?? [],
        imageUrl: book.imageUrl ?? null,
        description: book.description ?? "",
      });
    }
    setImageFile(null);
  }, [book, isOpen]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!book) return;
    const payload: BookForm = {
      ...form,
      category: form.category || "OTHER",
    };
    onUpdate(book.id, payload, imageFile);
    onClose();
  };

  if (!isOpen || !book) return null;

  return (
    <Modal isOpen={isOpen} title="Update Book" onClose={onClose}>
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

      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="current"
          style={{ width: 120, borderRadius: 6, margin: "8px 0" }}
        />
      )}

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
      <hr></hr>
      <div>
        <button type="button" onClick={() => setBranchModalOpen(true)}>
          支店選択 ({form.branchIds.length}개)
        </button>

        <BranchSelectModal
          isOpen={branchModalOpen}
          selectedIds={form.branchIds}
          onConfirm={(ids) => setForm((prev) => ({ ...prev, branchIds: ids }))}
          onClose={() => setBranchModalOpen(false)}
        />
      </div>

      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onClose}>
          キャンセル
        </button>
        <button
          className="modal-btn confirm"
          onClick={handleSubmit}
        >
          更新
        </button>
      </div>
    </Modal>
  );
};

export default UpdateBookModal;
