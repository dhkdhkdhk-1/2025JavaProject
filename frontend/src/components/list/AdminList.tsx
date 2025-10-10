import React from "react";
import type { Admin } from "../../types/Dashboard"; // 경로 맞게 조정

interface AdminListProps {
  admins: Admin[];
}

const AdminList: React.FC<AdminListProps> = ({ admins }) => {
  return (
    <div>
      <h4>관리자 목록</h4>
      <ul>
        {admins.map((a) => (
          <li key={a.id}>
            {a.name} — {a.id} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminList;
