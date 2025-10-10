import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "빌린 책", value: 75 },
  { name: "반납된 책", value: 25 },
];

const COLORS = ["#007bff", "#999"];

export default function PieChartBox() {
  return (
    <div
      style={{
        width: "100%",
        height: 300,
        background: "#fff",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
