import React, { useState, useEffect } from "react";
import { BranchResponse, BranchRequest } from "../../../api/BranchApi";
import "./BranchModal.css";

interface BranchModalProps {
  mode: "add" | "edit" | "view" | "delete";
  branch: BranchResponse | null;
  onClose: () => void;
  onAdd?: (form: BranchRequest) => void;
  onUpdate?: (form: BranchRequest) => void;
}

const BranchModal: React.FC<BranchModalProps> = ({
  mode,
  branch,
  onClose,
  onAdd,
  onUpdate,
}) => {
  const [form, setForm] = useState<BranchRequest>({
    id: branch?.id,
    name: branch?.name || "",
    location: branch?.location || "",
  });

  useEffect(() => {
    if (branch) {
      setForm({
        id: branch.id,
        name: branch.name,
        location: branch.location,
      });
    }
  }, [branch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (mode === "add" && onAdd) onAdd(form);
    if (mode === "edit" && onUpdate) onUpdate(form);
  };

  /** ======= View Mode ======= */
  if (mode === "view" && branch) {
    return (
      <div className="branch-modal">
        <div className="modal-content">
          <h3>View Branch</h3>
          <p>
            <b>지점명:</b> {branch.name}
          </p>
          <p>
            <b>주소:</b> {branch.location}
          </p>
          <button className="close-btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  /** ======= Delete Mode ======= */
  if (mode === "delete" && branch) {
    return (
      <div className="branch-modal">
        <div className="modal-content">
          <h3>Delete Confirmation</h3>
          <p>
            <b>{branch.name}</b> 지점을 삭제하시겠습니까?
          </p>
          <div className="btn-group">
            <button className="cancel-btn" onClick={onClose}>
              CANCEL
            </button>
            <button className="confirm-btn" onClick={() => onUpdate?.(form)}>
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    );
  }

  /** ======= Add / Edit Mode ======= */
  return (
    <div className="branch-modal">
      <div className="modal-content">
        <h3>{mode === "add" ? "Add Branch" : "Update Branch"}</h3>
        <input
          type="text"
          name="name"
          placeholder="지점명"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="주소"
          value={form.location}
          onChange={handleChange}
        />

        <div className="btn-group">
          <button className="cancel-btn" onClick={onClose}>
            CANCEL
          </button>
          <button className="confirm-btn" onClick={handleSubmit}>
            {mode === "add" ? "ADD" : "UPDATE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchModal;
