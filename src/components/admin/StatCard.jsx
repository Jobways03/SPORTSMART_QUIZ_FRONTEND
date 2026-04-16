import { Link } from "react-router-dom";

export default function StatCard({ label, value, icon, accent, to }) {
  const content = (
    <>
      <div className="adm-stat-top">
        <span className="adm-stat-icon">{icon}</span>
        <span className="adm-stat-label">{label}</span>
      </div>
      <div className="adm-stat-value">{value ?? "—"}</div>
      <div className="adm-stat-bar" />
      {to && <span className="adm-stat-arrow">→</span>}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="adm-stat-card adm-stat-card--link"
        style={{ "--sc": accent || "#1a2638" }}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="adm-stat-card" style={{ "--sc": accent || "#1a2638" }}>
      {content}
    </div>
  );
}
