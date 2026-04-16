export default function HeatmapTable({ data }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <div className="qa-card">
      <div className="qa-card-title">Question Difficulty Heatmap</div>
      <div className="qa-card-sub">Percentage of users who answered each question correctly</div>

      {list.length === 0 ? (
        <div className="qa-empty">No questions or submissions yet.</div>
      ) : (
        <div className="qa-table-wrap">
          <table className="qa-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Question</th>
                <th style={{ width: 180 }}>Correct %</th>
              </tr>
            </thead>
            <tbody>
              {list.map((q, i) => {
                const pct = q.correctPercentage ?? 0;
                const cls = pct > 70 ? "heat-good" : pct > 40 ? "heat-mid" : "heat-bad";
                const barColor = pct > 70 ? "#16a34a" : pct > 40 ? "#d97706" : "#dc2626";
                return (
                  <tr key={i}>
                    <td className="qa-td-num">{q.questionIndex ?? i + 1}</td>
                    <td className="qa-td-text">{q.questionText}</td>
                    <td>
                      <div className="qa-heatbar-wrap">
                        <div
                          className="qa-heatbar"
                          style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
                        />
                        <span className={`qa-heatpct ${cls}`}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
