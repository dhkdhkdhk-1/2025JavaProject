import { useEffect, useState } from "react";
import axios from "axios";

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/branch/list?page=${page}&size=5`)
      .then((res) => {
        // ✅ Page 응답 구조이므로 content에서 꺼내야 함
        setBranches(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => console.error("지점 목록 불러오기 실패:", err));
  }, [page]);

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      <h3>지점 목록 (페이지 {page + 1})</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {/* ✅ branches가 배열인지 확인하고 map 실행 */}
        {Array.isArray(branches) &&
          branches.map((b) => (
            <li
              key={b.id}
              style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}
            >
              {b.name} — {b.address}
            </li>
          ))}
      </ul>

      {/* 페이지 이동 버튼 */}
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          이전
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
}
