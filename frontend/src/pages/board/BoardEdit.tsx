import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoard, updateBoard } from "../../api/BoardApi";
import BoardForm from "./components/BoardForm";

const BoardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "일반",
  });

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        const res = await getBoard(Number(id));
        const data = res.data;
        setForm({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "일반",
        });
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        navigate("/board");
      }
    };

    fetchBoard();
  }, [id, navigate]);

  // ✅ 입력값 변경 핸들러 (BoardForm과 동일한 형태)
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

  // ✅ 게시글 수정 처리
  const handleSubmit = async () => {
    if (!id) return;

    // 🔸 제목·내용 공백 검증 추가
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await updateBoard(Number(id), form);
      alert("게시글이 수정되었습니다.");
      navigate("/board");
    } catch (err: any) {
      console.error("게시글 수정 중 오류:", err);

      // 🔸 백엔드 검증 에러 (400 Bad Request)
      if (err.response?.status === 400) {
        alert(
          err.response.data?.message || "제목과 내용을 모두 입력해야 합니다."
        );
      } else if (err.response?.status === 403) {
        alert("수정 권한이 없습니다.");
      } else {
        alert("게시글 수정 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <BoardForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEdit
    />
  );
};

export default BoardEdit;
