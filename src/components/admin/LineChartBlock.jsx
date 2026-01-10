import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LineChartBlock({ data }) {
  const chartData = (data?.labels || []).map((label, i) => ({
    date: label,
    Attempts: data.datasets?.attempts?.[i] ?? 0,
    Users: data.datasets?.activeUsers?.[i] ?? 0,
    AvgScore: data.datasets?.avgScore?.[i] ?? 0,
  }));

  return (
    <div className="chart-card">
      <h4>Daily Activity</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Attempts" strokeWidth={2} />
          <Line type="monotone" dataKey="Users" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
