import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMe } from "../../../api/AuthApi";
import {
  getCsDetail,
  answerCs,
  CsDetailResponse,
  CsCategory,
  CsAdminAnswerRequest,
} from "../../../api/CsApi";
import "./AnswerWrite.css";
import { formatDateJP } from "../../../types/Date";

// ✅ 카테고리 한글 변환
const getCategoryLabel = (category: CsCategory): string => {
  switch (category) {
    case CsCategory.BOOK:
      return "書籍関連";
    case CsCategory.ACCOUNT:
      return "アカウント関連";
    case CsCategory.ETC:
      return "その他";
    default:
      return category;
  }
};

const AnswerWrite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CsDetailResponse | null>(null);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ 페이지 진입 시 로그인 상태 및 문의 상세 정보 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
          return;
        }

        // 유저 정보 가져오기
        const userData = await getMe();

        // 관리자 권한 확인
        if (userData.role !== "ADMIN" && userData.role !== "MANAGER") {
          alert("このページにアクセスする権限がありません。");
          navigate("/admin/answer", { replace: true });
          return;
        }

        // 문의 상세 정보 가져오기
        if (id) {
          const csData = await getCsDetail(Number(id));
          setCs(csData);
          // 이미 답변이 있으면 답변 내용을 초기값으로 설정
          if (csData.answerContent) {
            setAnswerContent(csData.answerContent);
          }
        }
      } catch (err: any) {
        console.error("데이터 로딩 실패:", err);
        if (err.response?.status === 401) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
        } else if (err.response?.status === 403) {
          setError("このお問い合わせにアクセスする権限がありません。");
        } else if (err.response?.status === 404) {
          setError("お問い合わせが見つかりません。");
        } else {
          setError("お問い合わせの読み込みに失敗しました。");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  // ✅ 답변 제출 핸들러
  const handleSubmit = async () => {
    if (!id) {
      alert("お問い合わせIDが見つかりません。");
      return;
    }

    if (!answerContent.trim()) {
      alert("回答内容を入力してください。");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request: CsAdminAnswerRequest = {
        answerContent: answerContent.trim(),
      };

      await answerCs(Number(id), request);
      alert("回答が登録されました。");
      navigate("/admin/answer");
    } catch (err: any) {
      console.error("답변 등록 실패:", err);
      if (err.response?.status === 401) {
        alert("ログインが必要です。");
        navigate("/login", { replace: true });
      } else if (err.response?.status === 403) {
        setError("このお問い合わせに回答する権限がありません。");
      } else if (err.response?.status === 404) {
        setError("お問い合わせが見つかりません。");
      } else if (err.response?.status === 400) {
        const errorMessage =
          err.response?.data?.message || "入力内容を確認してください。";
        setError(errorMessage);
      } else {
        setError("回答の登録に失敗しました。");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="board-container">
        <div style={{ textAlign: "center", padding: "50px" }}>読み込み中...</div>
      </div>
    );
  }

  if (error && !cs) {
    return (
      <div className="board-container">
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          {error}
        </div>
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            className="board-button"
            onClick={() => navigate("/admin/answer")}
          >
            リストに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!cs) {
    return (
      <div className="board-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          お問い合わせが見つかりません。
        </div>
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            className="board-button"
            onClick={() => navigate("/admin/answer")}
          >
            リストに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="board-container">
      <h1 className="board-title">お問い合わせ回答</h1>

      {/* ✅ 문의 내용 */}
      <div className="board-content">
        <h3>📩 お問い合わせ内容</h3>            
        {/* ✅ 문의 정보 표시 */}
        <div className="board-meta">
          <div className="board-meta-row">
            <span className="board-meta-left">
            件名: <strong>{cs.title}</strong>
            <p style={{ whiteSpace: "pre-wrap" }}>{cs.content}</p>
            作成日: {formatDateJP(cs.createdAt)}
            </span>
        </div>
        <div className="board-meta-row">
          <span className="board-meta-left">
            支店: {cs.branchName} <br />
            分類: {getCategoryLabel(cs.category)}
          </span>
        </div>
      </div>
      </div>

      {/* ✅ 답변 작성 영역 */}
      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "10px", fontWeight: 600 }}>
          {cs.answerContent ? "回答を修正" : "回答を入力"}
        </label>
        <textarea
          className="board-textarea"
          rows={10}
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          placeholder="回答内容を入力してください"
          disabled={submitting}
        />
      </div>

      {/* ✅ 에러 메시지 */}
      {error && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            color: "red",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      {/* ✅ 버튼 영역 */}
      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="board-button"
          onClick={() => navigate("/admin/answer")}
          style={{ marginRight: "10px" }}
          disabled={submitting}
        >
          キャンセル
        </button>
        <button
          className="board-button"
          onClick={handleSubmit}
          disabled={submitting || !answerContent.trim()}
        >
          {submitting ? "登録中..." : cs.answerContent ? "回答を更新" : "回答を登録"}
        </button>
      </div>
    </div>
  );
};

export default AnswerWrite;
