export default function HeatmapTable({ data }) {
  const list = Array.isArray(data) ? data : [];

  return (
    <div className="chart-card">
      <h4>Question Difficulty Heatmap</h4>

      {list.length === 0 ? (
        <div className="empty-note">No questions / no submissions yet.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Correct %</th>
            </tr>
          </thead>
          <tbody>
            {list.map((q, i) => (
              <tr key={i}>
                <td>{q.questionIndex}</td>
                <td>{q.questionText}</td>
                <td
                  className={
                    q.correctPercentage > 70
                      ? "heat-good"
                      : q.correctPercentage > 40
                      ? "heat-mid"
                      : "heat-bad"
                  }
                >
                  {q.correctPercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
