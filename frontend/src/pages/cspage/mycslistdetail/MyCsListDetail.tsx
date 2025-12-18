import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMe, User } from "../../../api/AuthApi";
import { formatDateJP } from "../../../types/Date";
import {
  getCsDetail,
  CsDetailResponse,
  CsStatus,
  CsCategory,
} from "../../../api/CsApi";
import "./MyCsListDetail.css";

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

// ✅ 상태 한글 변환
const getStatusLabel = (status: CsStatus): string => {
  switch (status) {
    case CsStatus.WAITING:
      return "回答待ち";
    case CsStatus.COMPLETED:
      return "回答完了";
    default:
      return status;
  }
};

const MyCsListDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CsDetailResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
        setUser(userData);

        // 문의 상세 정보 가져오기
        if (id) {
          const csData = await getCsDetail(Number(id));
          setCs(csData);
        }
      } catch (err: any) {
        console.error("データ読み込みに失敗しました。:", err);
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

  if (loading) {
    return (
      <div className="cs-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          読み込み中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cs-container">
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          {error}
        </div>
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            className="cs-button"
            onClick={() => navigate("/mycslistpage")}
          >
            リストに戻る
          </button>
        </div>
      </div>
    );
  }

  if (!cs) {
    return (
      <div className="cs-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          お問い合わせが見つかりません。
        </div>
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <button
            className="cs-button"
            onClick={() => navigate("/mycslistpage")}
          >
            リストに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-container">
      <h1 className="cs-title">{cs.title}</h1>

      <div className="cs-meta">
        <div className="cs-meta-row">
          <span className="cs-meta-left">
            作成者: {user?.username || ""} &nbsp; | &nbsp; {cs.branchName} |{" "}
            {getCategoryLabel(cs.category)}
          </span>
          <span className="cs-meta-right">
            作成日: {formatDateJP(cs.createdAt)}
          </span>
        </div>
        <div className="cs-meta-row">
          <span className="cs-meta-left">
            状態:{" "}
            <span
              style={{
                color: cs.status === CsStatus.WAITING ? "orange" : "green",
                fontWeight: 600,
              }}
            >
              {getStatusLabel(cs.status)}
            </span>
          </span>
          {cs.answerCreatedAt && (
            <span className="cs-meta-right">
              回答日: {formatDateJP(cs.answerCreatedAt)}
            </span>
          )}
        </div>
      </div>

      <div className="cs-content">
        <h3>📩 お問い合わせ内容</h3>
        <p style={{ whiteSpace: "pre-wrap" }}>{cs.content}</p>
      </div>

      {cs.answerContent ? (
        <div className="cs-answer">
          <h3>💬 管理者の回答</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{cs.answerContent}</p>
        </div>
      ) : (
        <div className="cs-answer waiting">
          <h3>⌛ 回答待ち</h3>
          <p>現在担当者が確認中です。</p>
        </div>
      )}

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <button
          className="cs-button"
          onClick={() => navigate("/mycslistpage")}
          style={{ marginRight: "10px" }}
        >
          リストに戻る
        </button>
      </div>
    </div>
  );
};

export default MyCsListDetail;
