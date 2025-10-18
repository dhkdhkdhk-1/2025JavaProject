import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoard, updateBoard } from "../../api/BoardApi";
import BoardForm from "./components/BoardForm";

const BoardEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ category → type 으로 변경
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "일반",
  });

  useEffect(() => {
    if (id) {
      getBoard(Number(id)).then((res) => {
        // ✅ 백엔드에서 가져온 데이터 중 type만 사용
        setForm({
          title: res.data.title || "",
          content: res.data.content || "",
          type: res.data.type || "일반",
        });
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (id) {
      try {
        await updateBoard(Number(id), form);
        alert("게시글이 수정되었습니다.");
        navigate(`/board/${id}`);
      } catch (err) {
        console.error(err);
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
