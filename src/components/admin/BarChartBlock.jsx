import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartBlock({ data }) {
  const chartData = [
    { name: "Early", value: data?.buckets?.early ?? 0 },
    { name: "Medium", value: data?.buckets?.medium ?? 0 },
    { name: "Late", value: data?.buckets?.late ?? 0 },
  ];

  return (
    <div className="chart-card">
      <h4>Submission Timing Chart</h4>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
