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
      }
    };

    fetchBoard();
  }, [id]);

  // ✅ 타입 수정 (BoardForm과 호환)
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
    if (!id) return;
    try {
      await updateBoard(Number(id), form);
      alert("게시글이 수정되었습니다.");
      navigate("/board");
    } catch (err) {
      console.error("게시글 수정 중 오류:", err);
      alert("수정 중 오류가 발생했습니다.");
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
