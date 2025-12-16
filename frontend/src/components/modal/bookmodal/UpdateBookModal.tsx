import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import type { BookForm, Book } from "../../../api/BookApi";

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
    branchId: null,
    imageUrl: null,
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        category: book.category,
        available: book.available,
        branchId: book.branchId ?? null,
        imageUrl: book.imageUrl ?? null,
        description: book.description ?? "",
      });
    }
    setImageFile(null);
  }, [book, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "branchId" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = () => {
    if (!book) return;
    onUpdate(book.id, form, imageFile);
    onClose();
  };

  if (!isOpen || !book) return null;

  return (
    <Modal isOpen={isOpen} title="Update Book" onClose={onClose}>
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

      {/* 기존 이미지 미리보기 */}
      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="current"
          style={{ width: 120, borderRadius: 6, margin: "8px 0" }}
        />
      )}

      {/* 새 이미지 선택 */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      <input
        name="branchId"
        type="number"
        placeholder="지점 ID (예: 1)"
        value={form.branchId ?? ""}
        onChange={handleChange}
      />

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">카테고리 선택</option>
        <option value="NOVEL">소설</option>
        <option value="ESSAY">에세이</option>
        <option value="IT">IT / プログラミング</option>
        <option value="HISTORY">歴史</option>
        <option value="SCIENCE">科学</option>
        <option value="OTHER">その他</option>
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
