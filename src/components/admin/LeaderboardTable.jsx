const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardTable({ data }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <div className="qa-card">
      <div className="qa-card-title">Top Users</div>
      <div className="qa-card-sub">Highest scoring participants in this quiz</div>

      {list.length === 0 ? (
        <div className="qa-empty">No submissions yet.</div>
      ) : (
        <div className="qa-table-wrap">
          <table className="qa-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Rank</th>
                <th>User</th>
                <th style={{ width: 80, textAlign: "right" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u, i) => (
                <tr key={i} className={i < 3 ? "qa-row-top" : ""}>
                  <td className="qa-td-rank">
                    {i < 3 ? (
                      <span className="qa-medal">{MEDALS[i]}</span>
                    ) : (
                      <span className="qa-rank-num">{i + 1}</span>
                    )}
                  </td>
                  <td className="qa-td-text" style={{ fontWeight: i === 0 ? 900 : 700 }}>
                    {u.userName}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 900, color: "#1a2638", fontSize: 15 }}>
                    {u.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
