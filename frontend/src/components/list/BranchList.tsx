import React, { useState } from "react";
import type { Branch } from "../../types/Dashboard";

interface BranchListProps {
  branches: Branch[];
}

const BranchList: React.FC<BranchListProps> = ({ branches }) => {
  const [page, setPage] = useState(0);
  const pageSize = 3;

  const totalPages = Math.ceil(branches.length / pageSize);
  const current = branches.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="list-card">
      <h4>支店目録</h4>
      <ul>
        {current.map((b) => (
          <li key={b.id}>
            {b.name} — {b.id}
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          ◀ 以前
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
        >
          以降 ▶
        </button>
      </div>
    </div>
  );
};

export default BranchList;
