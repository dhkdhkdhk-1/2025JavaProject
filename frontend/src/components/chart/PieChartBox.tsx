import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PieChartBoxProps {
  borrowed: number;
  returned: number;
}

const PieChartBox: React.FC<PieChartBoxProps> = ({ borrowed, returned }) => {
  const data = [
    { name: "대여된 책", value: borrowed },
    { name: "반납된 책", value: returned },
  ];

  const COLORS = ["#4e79a7", "#c7c7c7"];

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartBox;
