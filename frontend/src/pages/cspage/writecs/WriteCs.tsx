// src/pages/cspage/writecs/WriteCs.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WriteCs.css"; // 주어진 디자인 그대로 사용

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
    type: "일반",
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
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // ✅ 더미 데이터로 콘솔 출력 (DB 연동 X)
    console.log("작성 완료!", form);
    alert("문의글이 작성되었습니다. (더미 데이터)");

    // 작성 후 목록 페이지로 이동
    navigate("/cs");
  };

  return (
    <div className="board-container">
      <h1 className="board-title">문의글 작성</h1>

      <label>제목</label>
      <input
        className="board-input"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="제목을 입력하세요"
      />

      <label style={{ marginTop: "15px", display: "block" }}>분류</label>
      <div style={{ margin: "10px 0" }}>
        {["도서관련", "계정관련", "기타"].map((t) => (
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

      <label>내용</label>
      <textarea
        className="board-textarea"
        rows={10}
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="문의 내용을 입력하세요"
      />

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="board-button" onClick={handleSubmit} type="button">
          작성
        </button>
      </div>
    </div>
  );
};

export default WriteCs;
