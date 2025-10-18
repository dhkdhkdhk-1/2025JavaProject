import React from "react";
import "../board.css";

interface Props {
  form: { title: string; content: string; type: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

const BoardForm: React.FC<Props> = ({ form, onChange, onSubmit, isEdit }) => {
  return (
    <div className="board-container">
      <h1 className="board-title">게시판 {isEdit ? "글 수정" : "글쓰기"}</h1>

      <label>제목</label>
      <input
        className="board-input"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="제목을 입력하세요"
      />

      <label style={{ marginTop: "15px", display: "block" }}>분류</label>
      <div style={{ margin: "10px 0" }}>
        {["일반", "질문", "요청"].map((t) => (
          <button
            key={t}
            onClick={() =>
              onChange({ target: { name: "type", value: t } } as any)
            }
            className={`board-button ${form.type === t ? "active" : ""}`}
            style={{ marginRight: "5px" }}
            type="button"
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
        onChange={onChange}
        placeholder="내용을 입력하세요"
      />

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button className="board-button" onClick={onSubmit} type="button">
          {isEdit ? "수정" : "작성"}
        </button>
      </div>
    </div>
  );
};

export default BoardForm;
