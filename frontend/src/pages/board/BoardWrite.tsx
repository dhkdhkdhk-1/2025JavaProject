import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardForm from "./components/BoardForm";
import { createBoard, BoardRequest } from "../../api/BoardApi";

const BoardWrite: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<BoardRequest>({
    title: "",
    content: "",
    type: "일반",
  });

  // ✅ 타입 유연하게 수정
  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      await createBoard(form);
      alert("게시글이 등록되었습니다.");
      navigate("/board");
    } catch (err) {
      console.error(err);
      alert("게시글 등록 실패 (인증 오류)");
    }
  };

  return (
    <BoardForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
  );
};

export default BoardWrite;
