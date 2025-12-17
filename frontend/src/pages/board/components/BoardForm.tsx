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
  boardType?: "一般" | "告知"; // ✅ 추가
}

const BoardForm: React.FC<Props> = ({
  form,
  onChange,
  onSubmit,
  isEdit,
  boardType = "掲示板",
}) => {
  const isNoticeBoard = boardType === "告知";

  const handleTypeChange = (type: string) => {
    onChange({ target: { name: "type", value: type } } as any);
  };

  return (
    <div className="board-container board-write">
      <h1 className="board-title">
        {isEdit
          ? boardType === "告知"
            ? "告知修正"
            : "投稿修正"
          : boardType === "告知"
          ? "告知作成"
          : "投稿する"}
      </h1>

      <label className="field-label">タイトル</label>
      <input
        className="board-input board-title-input"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="タイトルを書いてください。"
      />

      <label className="field-label">分類</label>
      <div className="category-area">
        {(isNoticeBoard
          ? ["告知", "入荷", "行事"]
          : ["一般", "質問", "リクエスト"]
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

      <label className="field-label">内容</label>
      <textarea
        className="board-textarea"
        rows={10}
        name="content"
        value={form.content}
        onChange={onChange}
        placeholder="内容を書いてください。"
      />

      <div className="submit-area">
        <button className="board-button" onClick={onSubmit} type="button">
          {isEdit ? "修正" : "作成"}
        </button>
      </div>
    </div>
  );
};

export default BoardForm;
