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
    (params.get("type") as "一般" | "告知") || ("一般" as "一般" | "告知");

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "一般",
  });

  const [boardType, setBoardType] = useState<"一般" | "告知">(typeParam);

  useEffect(() => {
    const fetchBoard = async () => {
      if (!id) return;
      try {
        const res = await getBoard(Number(id));
        const data = res.data;

        setForm({
          title: data.title || "",
          content: data.content || "",
          type: data.type || "一般",
        });

        if (["告知", "入荷", "行事"].includes(data.type)) {
          setBoardType("告知");
        } else {
          setBoardType("一般");
        }
      } catch {
        alert("投稿の読み込みに失敗しました。");
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
      alert("タイトルと内容を全部書いてください。");
      return;
    }

    try {
      await updateBoard(Number(id), form);
      alert("投稿を修正しました。");

      // 🔥 수정 후 이동할 게시판 타입 결정
      const goType = ["告知", "入荷", "行事"].includes(form.type)
        ? "notice"
        : "general";

      navigate(`/board?type=${goType}&refresh=1`);
    } catch (err: any) {
      console.error("投稿修正エラー:", err);
      if (err.response?.status === 403) {
        alert("修正権限がありません。");
      } else {
        alert("投稿の修正中エラーが発生しました。");
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
