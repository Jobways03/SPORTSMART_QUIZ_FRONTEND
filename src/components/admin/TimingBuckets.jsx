export default function TimingBuckets({ data }) {
  const buckets = data?.buckets || { early: 0, medium: 0, late: 0 };

  return (
    <div className="chart-card">
      <h4>Submission Breakdown</h4>
      <ul className="timing-list">
        <li>
          🟢 Early (&gt;30 min): <b>{buckets.early}</b>
        </li>
        <li>
          🟡 Medium (10–30 min): <b>{buckets.medium}</b>
        </li>
        <li>
          🔴 Late (&lt;10 min): <b>{buckets.late}</b>
        </li>
      </ul>
    </div>
  );
}
