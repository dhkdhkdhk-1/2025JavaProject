// src/pages/cspage/writecs/WriteCs.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteCs.css"; // デザインはそのまま使用

interface CsForm {
  title: string;
  content: string;
  type: string;
}

const WriteCs: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CsForm>({
    title: "",
    content: "",
    type: "一般",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("ログインが必要です。");
      navigate("/login");
      return;
    }

    // ✅ ダミーデータとして出力（DB連携なし）
    console.log("作成完了！", form);
    alert("お問い合わせが作成されました。（ダミーデータ）");

    // 作成後、一覧ページへ移動
    navigate("/cs");
  };

  return (
    <div className="board-container">
      <h1 className="board-title">お問い合わせ作成</h1>

      <label>タイトル</label>
      <input
        className="board-input"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="タイトルを入力してください"
      />

      <label style={{ marginTop: "15px", display: "block" }}>分類</label>
      <div style={{ margin: "10px 0" }}>
        {["書籍関連", "アカウント関連", "その他"].map((t) => (
          <button
            key={t}
            type="button"
            className={`board-button ${form.type === t ? "active" : ""}`}
            style={{ marginRight: "5px" }}
            onClick={() => handleChange({ target: { name: "type", value: t } })}
          >
            {t}
          </button>
        ))}
      </div>

      <label>内容</label>
      <textarea
        className="board-textarea"
        rows={10}
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="お問い合わせ内容を入力してください"
      />

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="board-button" onClick={handleSubmit} type="button">
          作成
        </button>
      </div>
    </div>
  );
};

export default WriteCs;
