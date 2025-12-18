import React, { useEffect, useState } from "react";
import { adminUpdateUser } from "../../../api/UserApi";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
import "./UserEditModal.css";

/** ✅ API User 타입에 맞춤 */
interface User {
  id: number;
  username: string;
  email: string;
  role: string;              // 🔥 핵심: string으로 통일
  branchId?: number | null;
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
    role: user.role,                 // ✅ 초기값 중요
    branchId: user.branchId ?? null,
  });

  const [branches, setBranches] = useState<BranchResponse[]>([]);

  /** ✅ 유저 변경 시 상태 초기화 */
  useEffect(() => {
    setForm({
      username: "",
      email: "",
      role: user.role,               // ❗ 빈 문자열 X
      branchId: user.branchId ?? null,
    });
  }, [user]);

  /** ✅ 지점 목록 조회 */
  useEffect(() => {
    getBranches(0, 100).then((res) => {
      setBranches(res.content);
    });
  }, []);

  /** ✅ 입력 변경 */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // MANAGER → 다른 권한이면 지점 제거
    if (name === "role" && value !== "MANAGER") {
      setForm((prev) => ({
        ...prev,
        role: value,
        branchId: null,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** ✅ 저장 */
  const handleSubmit = async () => {
    const finalRole = form.role || user.role;

    // MANAGER인데 지점 없으면 차단
    if (finalRole === "MANAGER" && !form.branchId) {
      alert("MANAGERは必ず支店を選択しなければなりません.");
      return;
    }

    const updatedData = {
      username: form.username || user.username,
      email: form.email || user.email,
      role: finalRole,
      branchId: finalRole === "MANAGER" ? form.branchId : null,
    };

    try {
      await adminUpdateUser(user.id, updatedData);
      alert("✅ 会員情報が修正されました.");
      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ 修正に失敗しました.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>会員情報修正</h2>

        {/* 이름 */}
        <label>名前</label>
        <input
          name="username"
          placeholder={user.username}
          value={form.username}
          onChange={handleChange}
        />

        {/* 이메일 */}
        <label>メール</label>
        <input
          name="email"
          placeholder={user.email}
          value={form.email}
          onChange={handleChange}
        />

        {/* 권한 */}
        <label>権限</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="USER">USER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        {/* ✅ MANAGER 전용 지점 선택 */}
        {form.role === "MANAGER" && (
          <>
            <label>支店</label>
            <select
              value={form.branchId ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  branchId: e.target.value
                    ? Number(e.target.value)
                    : null,
                }))
              }
            >
              <option value="">支店 選択</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.location})
                </option>
              ))}
            </select>
          </>
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>貯蔵</button>
          <button onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
