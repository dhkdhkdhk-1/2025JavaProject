// src/pages/cspage/admincs/AdminCsManager.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../board/board.css";

interface CsResponse {
  id: number;
  userId: number;
  username: string;
  branchName: string;
  title: string;
  content: string;
  answerContent?: string;
  status: string;
  csCategory: string;
  createdAt: string;
}

const AdminCsManager: React.FC = () => {
  const navigate = useNavigate();

  // ✅ ダミーデータ
  const dummyData: CsResponse[] = [
    {
      id: 1,
      userId: 101,
      username: "ホン・ギルドン",
      branchName: "ソウル支店",
      title: "本が返却できません",
      content: "返却したのにシステムに反映されていません。",
      answerContent: "確認後、反映が完了しました。",
      status: "COMPLETED",
      csCategory: "図書関連",
      createdAt: "2025-10-20T14:30:00",
    },
    {
      id: 2,
      userId: 101,
      username: "ホン・ギルドン",
      branchName: "プサン支店",
      title: "ログインできません",
      content: "パスワードを変更しましたが、ログインできません。",
      status: "WAITING",
      csCategory: "アカウント関連",
      createdAt: "2025-10-19T09:00:00",
    },
    {
      id: 3,
      userId: 101,
      username: "ホン・ギルドン",
      branchName: "テグ支店",
      title: "ホームページエラー",
      content: "お問い合わせボタンが押せません。",
      answerContent: "バグ修正中です。",
      status: "WAITING",
      csCategory: "その他",
      createdAt: "2025-10-18T11:45:00",
    },
  ];

  const [csList] = useState<CsResponse[]>(dummyData);

  return (
    <div className="admin-layout">
      <div className="admin-body">
        <main className="admin-content">
          <div className="book-header">
            <h2>📨 お問い合わせ管理</h2>
          </div>

          <table className="book-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>件名</th>
                <th>作成者</th>
                <th>支店</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {csList.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.username}</td>
                  <td>{c.branchName}</td>
                  <td
                    style={{
                      color:
                        c.status === "WAITING"
                          ? "orange"
                          : c.status === "ANSWERING"
                          ? "blue"
                          : "green",
                      fontWeight: 600,
                    }}
                  >
                    {c.status === "WAITING"
                      ? "対応待ち"
                      : c.status === "ANSWERING"
                      ? "対応中"
                      : "完了"}
                  </td>
                  <td>
                    <button
                      className="icon-btn edit"
                      onClick={() =>
                        navigate(`/admin/answerwrite/${c.id}`)
                      }
                    >
                      🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default AdminCsManager;
