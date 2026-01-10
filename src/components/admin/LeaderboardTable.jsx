export default function LeaderboardTable({ data }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <div className="chart-card">
      <h4>Top Users</h4>

      {list.length === 0 ? (
        <div className="empty-note">No submissions yet.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{u.userName}</td>
                <td>{u.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
