import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, User } from "../../../api/UserApi";
import UserEditModal from "../../../components/modal/usermodal/UserEditModal";
import "./Users.css";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ ページング状態
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ ユーザー一覧の取得
  const fetchUsers = async (pageNum = 0) => {
    try {
      const res = await getUsers(pageNum, 10);
      setUsers(res.content || res);
      setTotalPages(res.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("❌ ユーザー一覧の取得に失敗しました:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ 編集ボタン
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // ✅ 削除ボタン
  const handleDelete = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;
    await deleteUser(id);
    fetchUsers(page);
  };

  // ✅ ページ移動
  const handlePrev = () => {
    if (page > 0) fetchUsers(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) fetchUsers(page + 1);
  };

  // ✅ 検索フィルター（フロント側）
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search)
  );

  return (
    <div className="users-container">
      {/* 上部タイトル + 検索 + ボタン */}
      <div className="users-header">
        <h2>会員管理</h2>
        <div className="users-actions">
          <button
            className="add-btn"
            onClick={() => alert("手動追加機能は後で実装予定です！")}
          >
            + ユーザー追加
          </button>
          <input
            type="text"
            placeholder="ID / 名前 / メールで検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ユーザー一覧テーブル */}
      <div className="table-scroll">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>メール</th>
              <th>権限</th>
              <th>管理</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="action-buttons">
                    <button
                      className="icon-btn edit"
                      onClick={() => handleEdit(u)}
                      title="編集"
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(u.id)}
                      title="削除"
                    >
                      🗑️
                    </button>
                  </td>
                  <td>
                    {u.deleted ? (
                      <span className="status deleted">退会</span>
                    ) : (
                      <span className="status active">正常</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>データがありません。</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          ◀ 前へ
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages - 1}>
          次へ ▶
        </button>
      </div>

      {/* 編集モーダル */}
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
