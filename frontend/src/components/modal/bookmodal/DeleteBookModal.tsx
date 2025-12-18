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
      <p>選択した項目を削除しますか？</p>
      <div className="modal-actions">
        <button className="modal-btn cancel" onClick={onClose}>
          キャンセル
        </button>
        <button className="modal-btn confirm" onClick={onConfirm}>
          確認
        </button>
      </div>
    </Modal>
  );
};

export default DeleteBookModal;
