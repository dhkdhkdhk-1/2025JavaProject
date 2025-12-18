import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { getBranches, BranchResponse } from "../../../api/BranchApi";

interface Props {
  isOpen: boolean;
  selectedIds: number[];
  onConfirm: (ids: number[]) => void;
  onClose: () => void;
}

const BranchSelectModal: React.FC<Props> = ({
  isOpen,
  selectedIds,
  onConfirm,
  onClose,
}) => {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [checked, setChecked] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setChecked(selectedIds);
  }, [isOpen, selectedIds]);

  useEffect(() => {
    if (!isOpen) return;

    const fetch = async () => {
      const res = await getBranches(page, 10);
      const filtered = keyword
        ? res.content.filter((b) =>
            b.name.toLowerCase().includes(keyword.toLowerCase())
          )
        : res.content;

      setBranches(filtered);
      setTotalPages(res.totalPages);
    };

    fetch();
  }, [isOpen, page, keyword]);

  const toggle = (id: number) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(checked);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} title="支店選択" onClose={onClose}>
      <input
        placeholder="支店検索"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setPage(0);
        }}
      />

      <div style={{ maxHeight: 300, overflowY: "auto", marginTop: 10 }}>
        {branches.map((b) => (
          <label key={b.id} style={{ display: "block", padding: "4px 0" }}>
            <input
              type="checkbox"
              checked={checked.includes(b.id)}
              onChange={() => toggle(b.id)}
            />
            {b.name} ({b.location})
          </label>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          前へ
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          次へ
        </button>
      </div>

      <div className="modal-actions">
        <button onClick={onClose}>キャンセル</button>
        <button onClick={handleConfirm}>選択完了 ({checked.length})</button>
      </div>
    </Modal>
  );
};

export default BranchSelectModal;
