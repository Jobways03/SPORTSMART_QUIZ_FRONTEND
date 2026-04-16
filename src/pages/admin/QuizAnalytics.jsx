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
    <div className="qa-page">
      {/* ── HEADER ── */}
      <div className="qa-header">
        <div className="qa-header-left">
          <div className="qa-page-title">Quiz Analytics</div>
          <div className="qa-page-sub">
            <span className="qa-id-badge">ID: {quizId}</span>
          </div>
        </div>
        <Link to="/admin/analytics" className="qa-back-btn">
          ← Back to Analytics
        </Link>
      </div>

      {/* ── STATES ── */}
      {loading && (
        <div className="qa-loading-wrap">
          {[1, 2, 3].map((i) => <div key={i} className="qa-skeleton" />)}
        </div>
      )}
      {error && <div className="qa-error">{error}</div>}

      {/* ── CONTENT ── */}
      {!loading && !error && (
        <div className="qa-body">
          {/* Heatmap — full width */}
          <HeatmapTable data={heatmap} />

          {/* Two columns: leaderboard + timing buckets */}
          <div className="qa-two-col">
            <LeaderboardTable data={leaders} />
            {timing
              ? <TimingBuckets data={timing} />
              : <div className="qa-card qa-empty">No timing data available.</div>
            }
          </div>

          {/* Bar chart — full width */}
          {timing && <BarChartBlock data={timing} />}
        </div>
      )}
    </div>
  );
}
