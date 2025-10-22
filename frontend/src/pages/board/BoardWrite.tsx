import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BoardForm from "./components/BoardForm";
import { createBoard, BoardRequest } from "../../api/BoardApi";

interface BoardWriteProps {
  boardType?: "일반" | "공지";
}

const BoardWrite: React.FC<BoardWriteProps> = ({ boardType = "일반" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ URL의 type값 우선 적용
  const params = new URLSearchParams(location.search);
  const typeParam =
    (params.get("type") as "일반" | "공지") || boardType || "일반";

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
      alert("제목과 내용을 모두 입력하세요.");
      return;
    }

    try {
      await createBoard(form);
      alert("게시글이 등록되었습니다.");
      navigate(`/board?type=${typeParam}&refresh=1`);
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      alert("게시글 등록 중 오류가 발생했습니다.");
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
