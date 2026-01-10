export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <h3>{value}</h3>
    </div>
  );
}
