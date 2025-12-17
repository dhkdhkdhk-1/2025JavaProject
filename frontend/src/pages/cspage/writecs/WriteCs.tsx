// src/pages/cspage/writecs/WriteCs.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBranches, BranchResponse } from "../../../api/BranchApi";
import { registerCs, CsCategory, CsRegisterRequest } from "../../../api/CsApi";
import "./WriteCs.css";

interface CsForm {
  title: string;
  content: string;
  category: CsCategory;
  branchId: number | null;
}

const WriteCs: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CsForm>({
    title: "",
    content: "",
    category: CsCategory.BOOK,
    branchId: null,
  });
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // ✅ 지점 목록 로딩
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoadingBranches(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
          return;
        }

        // 지점 목록 가져오기 (모든 페이지에서 가져오기)
        let allBranches: BranchResponse[] = [];
        let page = 0;
        let hasMore = true;

        while (hasMore) {
          const response = await getBranches(page, 100);
          allBranches = [...allBranches, ...response.content];
          hasMore = page < response.totalPages - 1;
          page++;
        }

        setBranches(allBranches);
        // 첫 번째 지점을 기본값으로 설정 (이미 값이 있으면 그대로 유지)
        if (allBranches.length > 0) {
          setForm((prev) =>
            prev.branchId ? prev : { ...prev, branchId: allBranches[0].id }
          );
        }
      } catch (err: any) {
        console.error("지점 목록 로딩 실패:", err);
        if (err.response?.status === 401) {
          alert("ログインが必要です。");
          navigate("/login", { replace: true });
        } else {
          alert("支店リストの読み込みに失敗しました。");
        }
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, [navigate]);

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number } }
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCategoryChange = (category: CsCategory) => {
    setForm({ ...form, category });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("ログインが必要です。");
      navigate("/login", { replace: true });
      return;
    }

    // ✅ 유효성 검사
    if (!form.title.trim()) {
      alert("タイトルを入力してください。");
      return;
    }

    if (!form.content.trim()) {
      alert("内容を入力してください。");
      return;
    }

    if (!form.branchId) {
      alert("支店を選択してください。");
      return;
    }

    try {
      setLoading(true);

      const request: CsRegisterRequest = {
        title: form.title.trim(),
        content: form.content.trim(),
        category: form.category,
        branchId: form.branchId,
      };

      await registerCs(request);
      alert("お問い合わせが作成されました。");
      navigate("/mycslistpage");
    } catch (err: any) {
      console.error("문의 등록 실패:", err);
      if (err.response?.status === 401) {
        alert("ログインが必要です。");
        navigate("/login", { replace: true });
      } else if (err.response?.status === 400) {
        const errorMessage =
          err.response?.data?.message || "入力内容を確認してください。";
        alert(errorMessage);
      } else {
        alert("お問い合わせの作成に失敗しました。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-container">
      <h1 className="cs-title">お問い合わせ作成</h1>
      <div className="cs-content">
        <label className="cs-label">タイトル</label>
        <input
          className="cs-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="タイトルを入力してください"
          disabled={loading}
        />

        <label className="cs-label" style={{ marginTop: "15px" }}>
          支店
        </label>
        {loadingBranches ? (
          <div style={{ margin: "10px 0" }}>支店リストを読み込み中...</div>
        ) : (
          <select
            className="cs-input"
            name="branchId"
            value={form.branchId || ""}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">支店を選択してください</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        )}

        <label className="cs-label" style={{ marginTop: "15px" }}>
          分類
        </label>
        <div className="cs-category">
          {[
            { value: CsCategory.BOOK, label: "書籍関連" },
            { value: CsCategory.ACCOUNT, label: "アカウント関連" },
            { value: CsCategory.ETC, label: "その他" },
          ].map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`cs-button ${
                form.category === cat.value ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(cat.value)}
              disabled={loading}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <label className="cs-label">内容</label>
        <textarea
          className="cs-textarea"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="お問い合わせ内容を入力してください"
          disabled={loading}
        />
      </div>
      <div className="cs-actions">
        <button
          className="cs-button"
          onClick={() => navigate("/mycslistpage")}
          disabled={loading}
        >
          キャンセル
        </button>
        <button
          className="cs-button"
          onClick={handleSubmit}
          disabled={loading || loadingBranches}
        >
          {loading ? "作成中..." : "作成"}
        </button>
      </div>
    </div>
  );
};

export default WriteCs;
