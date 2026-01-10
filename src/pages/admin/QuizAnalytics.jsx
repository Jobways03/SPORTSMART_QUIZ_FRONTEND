import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/adminAnalytics.css";

import {
  fetchQuizHeatmap,
  fetchTopUsersByQuiz,
  fetchSubmissionTiming,
} from "../../services/adminAnalytics.service";

import HeatmapTable from "../../components/admin/HeatmapTable";
import LeaderboardTable from "../../components/admin/LeaderboardTable";
import BarChartBlock from "../../components/admin/BarChartBlock";
import TimingBuckets from "../../components/admin/TimingBuckets";

export default function QuizAnalytics() {
  const { quizId } = useParams();

  const [heatmap, setHeatmap] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [timing, setTiming] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [hm, top, t] = await Promise.all([
          fetchQuizHeatmap(quizId),
          fetchTopUsersByQuiz(quizId, 10),
          fetchSubmissionTiming(quizId),
        ]);

        setHeatmap(Array.isArray(hm) ? hm : []);
        setLeaders(Array.isArray(top) ? top : []);
        setTiming(t || null);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load quiz analytics");
      } finally {
        setLoading(false);
      }
    }

    if (quizId) load();
  }, [quizId]);

  return (
    <div className="admin-page">
      <div className="admin-analytics-header">
        <div>
          <h2>Quiz Analytics</h2>
          <p className="analytics-subtitle">Quiz ID: {quizId}</p>
        </div>

        <Link to="/admin/analytics" className="secondary-action-btn">
          ← Back
        </Link>
      </div>

      {loading && <div className="admin-loading">Loading…</div>}
      {error && <div className="admin-error">{error}</div>}

      {!loading && !error && (
        <>
          <HeatmapTable data={heatmap} />

          <div className="two-col">
            <LeaderboardTable data={leaders} />
            {timing ? (
              <TimingBuckets data={timing} />
            ) : (
              <div className="chart-card">No timing data.</div>
            )}
          </div>

          {timing && <BarChartBlock data={timing} />}
        </>
      )}
    </div>
  );
}
