import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = {
  Early:  "#16a34a",
  Medium: "#d97706",
  Late:   "#dc2626",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.97)",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 10,
      padding: "8px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      fontFamily: "Lexend, system-ui, sans-serif",
      fontSize: 13,
      fontWeight: 700,
      color: "#1a2332",
    }}>
      {label}: <b style={{ color: COLORS[label] }}>{payload[0]?.value}</b>
    </div>
  );
};

export default function BarChartBlock({ data }) {
  const chartData = [
    { name: "Early",  value: data?.buckets?.early  ?? 0 },
    { name: "Medium", value: data?.buckets?.medium ?? 0 },
    { name: "Late",   value: data?.buckets?.late   ?? 0 },
  ];

  return (
    <div className="qa-card">
      <div className="qa-card-title">Submission Timing Chart</div>
      <div className="qa-card-sub">When participants submitted relative to match start</div>
      <div style={{ marginTop: 18 }}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barSize={48} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fontFamily: "Lexend, system-ui, sans-serif", fill: "#6b7c8f", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fontFamily: "Lexend, system-ui, sans-serif", fill: "#6b7c8f", fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
