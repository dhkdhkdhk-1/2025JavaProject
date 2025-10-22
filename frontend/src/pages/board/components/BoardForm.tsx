import React from "react";
import "../board.css";

interface Props {
  form: { title: string; content: string; type: string };
  onChange: (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => void;
  onSubmit: () => void;
  isEdit?: boolean;
  boardType?: "일반" | "공지"; // ✅ 추가
}

const BoardForm: React.FC<Props> = ({
  form,
  onChange,
  onSubmit,
  isEdit,
  boardType = "일반",
}) => {
  const isNoticeBoard = boardType === "공지";

  const handleTypeChange = (type: string) => {
    onChange({ target: { name: "type", value: type } } as any);
  };

  return (
    <div className="board-container">
      <h1 className="board-title">{isEdit ? "글 수정" : "글쓰기"}</h1>

      <label>제목</label>
      <input
        className="board-input"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="제목을 입력하세요"
      />

      <label>분류</label>
      <div style={{ margin: "10px 0" }}>
        {(isNoticeBoard
          ? ["공지", "입고", "행사"]
          : ["일반", "질문", "요청"]
        ).map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
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
