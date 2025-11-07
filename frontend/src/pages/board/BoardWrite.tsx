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

  // ✅ 입력값 변경 핸들러
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

  // ✅ 게시글 등록 처리
  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // ✅ 제목·내용 공백 확인
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await createBoard(form);
      alert("게시글이 등록되었습니다.");
      navigate("/board");
    } catch (err: any) {
      console.error("게시글 등록 실패:", err);

      // ✅ 백엔드에서 검증 에러 (400 Bad Request) 시
      if (err.response?.status === 400) {
        alert(
          err.response.data?.message || "제목과 내용을 모두 입력해야 합니다."
        );
      } else {
        alert("게시글 등록 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <BoardForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
  );
};

export default BoardWrite;
