import React from "react";
import type { Borrower } from "../../types/Dashboard";

interface BorrowerListProps {
  borrowers: Borrower[];
}

const BorrowerList: React.FC<BorrowerListProps> = ({ borrowers }) => {
  return (
    <div>
      <h4>延滞者リスト</h4>
      <ul>
        {borrowers.map((b, i) => (
          <li key={i}>
            {b.name} — {b.book}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BorrowerList;
