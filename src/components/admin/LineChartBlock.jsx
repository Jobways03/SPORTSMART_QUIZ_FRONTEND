import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.97)",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      fontFamily: "Lexend, system-ui, sans-serif",
    }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#6b7c8f", marginBottom: 6 }}>{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} style={{ fontSize: 13, fontWeight: 700, color: entry.color, display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
          {entry.name}: <b>{entry.value}</b>
        </div>
      ))}
    </div>
  );
};

export default function LineChartBlock({ data }) {
  const chartData = (data?.labels || []).map((label, i) => ({
    date: label,
    Attempts: data.datasets?.attempts?.[i] ?? 0,
    Users: data.datasets?.activeUsers?.[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fontFamily: "Lexend, system-ui, sans-serif", fill: "#6b7c8f", fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fontFamily: "Lexend, system-ui, sans-serif", fill: "#6b7c8f", fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,0,0,0.06)", strokeWidth: 2 }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, fontFamily: "Lexend, system-ui, sans-serif", fontWeight: 700, paddingTop: 12 }}
        />
        <Line
          type="monotone"
          dataKey="Attempts"
          stroke="#1a2638"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#1a2638", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#1a2638" }}
        />
        <Line
          type="monotone"
          dataKey="Users"
          stroke="#0f766e"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#0f766e", strokeWidth: 0 }}
          activeDot={{ r: 5, fill: "#0f766e" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
