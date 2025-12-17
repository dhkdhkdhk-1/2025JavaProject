import React from "react";
import Modal from "../Modal";

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteBookModal: React.FC<Props> = ({ isOpen, onConfirm, onClose }) => {
  return (
    <Modal isOpen={isOpen} title="Delete Confirmation" onClose={onClose}>
      <p>선택한 항목을 삭제하시겠습니까?</p>
      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onClose}>
          CANCEL
        </button>
        <button className="modal-btn confirm" onClick={onConfirm}>
          CONFIRM
        </button>
      </div>
    </Modal>
  );
};

export default DeleteBookModal;
