import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, User } from "../../../api/UserApi";
import UserEditModal from "../../../components/modal/usermodal/UserEditModal";
import "./Users.css";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ 페이징용 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ 유저 목록 가져오기
  const fetchUsers = async (pageNum = 0) => {
    try {
      const res = await getUsers(pageNum, 10); // 한 페이지당 10명
      setUsers(res.content || res);
      setTotalPages(res.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("❌ 유저 목록 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ 수정 버튼
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // ✅ 삭제 버튼
  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    await deleteUser(id);
    fetchUsers(page);
  };

  // ✅ 페이지 이동
  const handlePrev = () => {
    if (page > 0) fetchUsers(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) fetchUsers(page + 1);
  };

  return (
    <div className="users-container">
      <h2>회원 관리</h2>

      {/* ✅ 유저 테이블 */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>권한</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="user-actions">
                  <button className="edit-btn" onClick={() => handleEdit(u)}>
                    수정
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(u.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ 페이지네이션 */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ 이전
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          다음 ▶
        </button>
      </div>

      {/* ✅ 수정 모달 */}
      {showModal && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onUpdated={() => fetchUsers(page)}
        />
      )}
    </div>
  );
};

export default Users;
