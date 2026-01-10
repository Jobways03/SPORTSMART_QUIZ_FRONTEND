import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "../../styles/admin-dashboard.css";

import {
  fetchDashboardAnalytics,
  fetchTimeSeriesAnalytics,
} from "../../services/adminAnalytics.service";

import StatCard from "../../components/admin/StatCard";
import LineChartBlock from "../../components/admin/LineChartBlock";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const [stats, setStats] = useState(null);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const [s, ts] = await Promise.all([
          fetchDashboardAnalytics(),
          fetchTimeSeriesAnalytics(),
        ]);
        setStats(s);
        setSeries(ts);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const onLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div>
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <div className="dashboard-subtitle">
            Logged in as <b>{admin?.email}</b> · Role: <b>{admin?.role}</b>
          </div>
        </div>

        <button className="dashboard-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Match & Quiz Management</h3>
          <p className="card-description">
            Create and manage matches, quizzes, and questions.
          </p>

          <Link to="/admin/matches" className="primary-action-btn">
            Manage Matches
          </Link>
        </div>

        <div className="dashboard-card analytics-card">
          <div className="analytics-head">
            <div>
              <h3>Platform Analytics</h3>
              <p className="card-description">
                Usage and performance overview.
              </p>
            </div>
            <Link to="/admin/analytics" className="secondary-action-btn">
              Detailed Analytics →
            </Link>
          </div>

          {loading && <div className="admin-loading">Loading…</div>}
          {error && <div className="admin-error">{error}</div>}

          {!loading && !error && stats && (
            <>
              <div className="stat-grid">
                <StatCard label="Matches" value={stats.totals.matches} />
                <StatCard label="Quizzes" value={stats.totals.quizzes} />
                <StatCard label="Users" value={stats.totals.users} />
                <StatCard label="Attempts" value={stats.totals.attempts} />
              </div>

              {series && <LineChartBlock data={series} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
