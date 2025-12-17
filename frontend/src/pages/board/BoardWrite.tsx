import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BoardForm from "./components/BoardForm";
import { createBoard, BoardRequest } from "../../api/BoardApi";

interface BoardWriteProps {
  boardType?: "一般" | "告知";
}

const BoardWrite: React.FC<BoardWriteProps> = ({ boardType = "一般" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ URL의 type값 우선 적용
  const params = new URLSearchParams(location.search);
  const typeParam =
    (params.get("type") as "一般" | "告知") || boardType || "一般";

  const [form, setForm] = useState<BoardRequest>({
    title: "",
    content: "",
    type: typeParam,
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, type: typeParam }));
  }, [typeParam]);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("タイトルと内容を全部書いてください。");
      return;
    }

    try {
      await createBoard(form);
      alert("投稿が登録されました。");
      const goType = ["告知", "入荷", "行事"].includes(form.type)
        ? "notice"
        : "general";

      navigate(`/board?type=${goType}&refresh=1`);
    } catch (err) {
      console.error("投稿登録失敗:", err);
      alert("投稿を登録している中エラーが発生しました。");
    }
  };

  return (
    <BoardForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      boardType={typeParam}
    />
  );
};

export default BoardWrite;
