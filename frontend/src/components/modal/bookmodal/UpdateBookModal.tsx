import React, { useState, useEffect } from "react";
import Modal from "../Modal";

interface Props {
  isOpen: boolean;
  book: any; // id, imageUrl 있으면 미리보기 가능
  onUpdate: (formData: FormData) => void;
  onClose: () => void;
}

const UpdateBookModal: React.FC<Props> = ({
  isOpen,
  book,
  onUpdate,
  onClose,
}) => {
  const [form, setForm] = useState<any>(book || {});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    setForm(book || {});
    setImageFile(null);
  }, [book, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form?.id) return;

    const fd = new FormData();
    fd.append(
      "book",
      JSON.stringify({
        id: form.id,
        title: form.title ?? "",
        author: form.author ?? "",
        publisher: form.publisher ?? "",
        category: form.category ?? "",
        branchId:
          form.branchId == null || form.branchId === ""
            ? null
            : Number(form.branchId),
      })
    );

    // ✅ 새 파일이 있을 때만 교체(서버에서 old 삭제 + new 업로드)
    if (imageFile) fd.append("image", imageFile);

    onUpdate(fd);
    onClose();
  };

  if (!isOpen) return null;

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

      {/* (선택) 기존 이미지 보여주기 */}
      {form.imageUrl ? (
        <img
          src={form.imageUrl}
          alt="current"
          style={{ width: 120, borderRadius: 6, margin: "8px 0" }}
        />
      ) : null}

      {/* ✅ 새 이미지 선택(선택) */}
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

      <select
        name="category"
        value={form.category ?? ""}
        onChange={handleChange}
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
