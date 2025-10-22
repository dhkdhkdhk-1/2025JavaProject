import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getBoard, updateBoard } from "../../api/BoardApi";
import BoardForm from "./components/BoardForm";

const BoardEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const typeParam =
    (params.get("type") as "일반" | "공지") || ("일반" as "일반" | "공지");

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "일반",
  });

  const [boardType, setBoardType] = useState<"일반" | "공지">(typeParam);

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

        if (["공지", "입고", "행사"].includes(data.type)) {
          setBoardType("공지");
        } else {
          setBoardType("일반");
        }
      } catch {
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        navigate("/board");
      }
    };
    fetchBoard();
  }, [id, navigate]);

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
    if (!id) return;
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await updateBoard(Number(id), form);
      alert("게시글이 수정되었습니다.");
      navigate(`/board?type=${boardType}&refresh=1`);
    } catch (err: any) {
      console.error("게시글 수정 오류:", err);
      if (err.response?.status === 403) {
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
      boardType={boardType}
    />
  );
};

export default BoardEdit;
