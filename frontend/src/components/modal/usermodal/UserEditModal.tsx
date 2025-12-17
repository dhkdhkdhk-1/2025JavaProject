import React, { useState } from "react";
import { adminUpdateUser } from "../../../api/UserApi";
import "./UserEditModal.css";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Props {
  user: User;
  onClose: () => void;
  onUpdated: () => void;
}

const UserEditModal: React.FC<Props> = ({ user, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const updatedData = {
      username: form.username || user.username,
      email: form.email || user.email,
      role: form.role || user.role,
    };

    await adminUpdateUser(user.id, updatedData);
    alert("✅ 회원 정보가 수정되었습니다.");
    onUpdated();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>회원 정보 수정</h2>

        <label>이름</label>
        <input
          name="username"
          placeholder={user.username}
          value={form.username}
          onChange={handleChange}
        />

        <label>이메일</label>
        <input
          name="email"
          placeholder={user.email}
          value={form.email}
          onChange={handleChange}
        />

        <label>권한</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="">현재: {user.role}</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
        </select>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>저장</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
