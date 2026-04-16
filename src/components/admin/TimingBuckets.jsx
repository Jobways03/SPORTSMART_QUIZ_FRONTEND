const BUCKETS = [
  { key: "early",  label: "Early",  sub: ">30 min before start", color: "#16a34a", bg: "rgba(220,252,231,0.5)", border: "rgba(22,163,74,0.2)",  icon: "🟢" },
  { key: "medium", label: "Medium", sub: "10–30 min before",     color: "#d97706", bg: "rgba(254,243,199,0.5)", border: "rgba(217,119,6,0.2)",  icon: "🟡" },
  { key: "late",   label: "Late",   sub: "<10 min before",       color: "#dc2626", bg: "rgba(254,226,226,0.5)", border: "rgba(220,38,38,0.2)",   icon: "🔴" },
];

export default function TimingBuckets({ data }) {
  const buckets = data?.buckets || { early: 0, medium: 0, late: 0 };
  const total = (buckets.early || 0) + (buckets.medium || 0) + (buckets.late || 0);

  return (
    <div className="qa-card">
      <div className="qa-card-title">Submission Breakdown</div>
      <div className="qa-card-sub">
        {total} total submission{total !== 1 ? "s" : ""} across all timing windows
      </div>

      <div className="qa-buckets">
        {BUCKETS.map(({ key, label, sub, color, bg, border, icon }) => {
          const count = buckets[key] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={key}
              className="qa-bucket-row"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <div className="qa-bucket-left">
                <span className="qa-bucket-icon">{icon}</span>
                <div>
                  <div className="qa-bucket-label" style={{ color }}>{label}</div>
                  <div className="qa-bucket-sub">{sub}</div>
                </div>
              </div>
              <div className="qa-bucket-right">
                <div className="qa-bucket-count" style={{ color }}>{count}</div>
                <div className="qa-bucket-pct">{pct}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
