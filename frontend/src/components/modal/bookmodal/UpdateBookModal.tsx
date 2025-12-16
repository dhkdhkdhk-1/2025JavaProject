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
        placeholder="제목"
        value={form.title}
        onChange={handleTextChange}
      />
      <input
        name="author"
        placeholder="저자"
        value={form.author}
        onChange={handleTextChange}
      />
      <input
        name="publisher"
        placeholder="출판사"
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
        <option value="">카테고리 선택</option>
        <option value="NOVEL">소설</option>
        <option value="ESSAY">에세이</option>
        <option value="IT">IT</option>
        <option value="HISTORY">역사</option>
        <option value="SCIENCE">과학</option>
        <option value="OTHER">기타</option>
      </select>
      <hr></hr>
      <div>
        <button type="button" onClick={() => setBranchModalOpen(true)}>
          지점 선택 ({form.branchIds.length}개)
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
          CANCEL
        </button>
        <button
          className="modal-btn confirm"
          onClick={handleSubmit}
          disabled={form.branchIds.length === 0}
        >
          UPDATE
        </button>
      </div>
    </Modal>
  );
};

export default UpdateBookModal;
