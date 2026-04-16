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

/* ── Inline SVG Icons ─────────────────────────────────────────── */
const IconCreate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const IconMatches = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3"/>
    <path d="M8 4v4M16 4v4M3 10h18"/>
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconQuiz = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
);
const IconScore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ── Helpers ──────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitial(email) {
  return email ? email.charAt(0).toUpperCase() : "A";
}

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const ACTION_CARDS = [
  {
    icon: <IconCreate />,
    title: "Create Match",
    description: "Add a new cricket match with title, date, and cover image.",
    link: "/admin/matches",
    accent: "#16a34a",
    bg: "rgba(22,163,74,0.07)",
    highlight: true,
  },
  {
    icon: <IconMatches />,
    title: "Manage Matches",
    description: "Edit status, update details, and delete existing matches.",
    link: "/admin/matches",
    accent: "#1a2638",
    bg: "rgba(26,38,56,0.07)",
  },
  {
    icon: <IconAnalytics />,
    title: "Analytics",
    description: "Deep-dive into quiz performance, heatmaps, and player stats.",
    link: "/admin/analytics",
    accent: "#0369a1",
    bg: "rgba(3,105,161,0.07)",
  },
  {
    icon: <IconQuiz />,
    title: "Quizzes & Answers",
    description: "Build questions and set correct answers after match ends.",
    link: "/admin/quiz-hub",
    accent: "#0f766e",
    bg: "rgba(15,118,110,0.07)",
  },
  {
    icon: <IconScore />,
    title: "Score & Publish",
    description: "Grade all responses and publish results to participants.",
    link: "/admin/score-publish",
    accent: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
  },
];

/* ── Component ────────────────────────────────────────────────── */
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

  const adminName = admin?.email?.split("@")[0] || "Admin";

  return (
    <div className="adm-page">
      {/* ── HEADER ────────────────────────────────────────────── */}
      <header className="adm-header">
        <div className="adm-brand">
          <div className="adm-brand-mark" />
          <span className="adm-brand-text">SportSmart Admin</span>
        </div>

        <div className="adm-header-right">
          <div className="adm-admin-pill">
            <div className="adm-avatar">{getInitial(admin?.email)}</div>
            <div className="adm-admin-meta">
              <span className="adm-admin-email">{admin?.email || "—"}</span>
              <span className="adm-admin-role">{admin?.role || "—"}</span>
            </div>
          </div>
          <button className="adm-logout-btn" onClick={onLogout}>
            <span className="adm-btn-icon"><IconLogout /></span>
            Logout
          </button>
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <main className="adm-body">

        {/* WELCOME BANNER */}
        <div className="adm-welcome">
          <div className="adm-welcome-left">
            <div className="adm-greeting">{getGreeting()}, {adminName} 👋</div>
            <div className="adm-welcome-date">{today}</div>
          </div>
          <div className="adm-live-badge">
            <span className="adm-live-dot" />
            Platform Live
          </div>
        </div>

        {/* STAT CARDS */}
        <section className="adm-stats-section">
          {loading && (
            <div className="adm-skeleton-row">
              {[1, 2, 3, 4].map((i) => <div key={i} className="adm-skeleton-card" />)}
            </div>
          )}
          {error && <div className="adm-error-box">{error}</div>}
          {!loading && !error && stats && (
            <div className="adm-stat-grid">
              <StatCard label="Matches"  value={stats.totals.matches}  icon="🏏" accent="#1a2638" to="/admin/matches" />
              <StatCard label="Quizzes"  value={stats.totals.quizzes}  icon="📋" accent="#0369a1" to="/admin/analytics" />
              <StatCard label="Users"    value={stats.totals.users}    icon="👥" accent="#0f766e" to="/admin/users" />
              <StatCard label="Attempts" value={stats.totals.attempts} icon="⚡" accent="#7c3aed" to="/admin/analytics" />
            </div>
          )}
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <div className="adm-section-label">Quick Actions</div>
          <div className="adm-action-grid">
            {ACTION_CARDS.map((card) => (
              <Link
                key={card.title}
                to={card.link}
                className={`adm-action-card${card.highlight ? " adm-action-card--highlight" : ""}`}
                style={{ "--ac": card.accent, "--ac-bg": card.bg }}
              >
                <div className="adm-action-icon-wrap">
                  {card.icon}
                </div>
                <div className="adm-action-body">
                  <div className="adm-action-title">{card.title}</div>
                  <div className="adm-action-desc">{card.description}</div>
                </div>
                <div className="adm-action-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>

        {/* CHART */}
        {!loading && !error && series && (
          <section className="adm-chart-section">
            <div className="adm-chart-header">
              <div className="adm-chart-title">Daily Activity</div>
              <div className="adm-chart-subtitle">Attempts & active users over time</div>
            </div>
            <div className="adm-chart-body">
              <LineChartBlock data={series} />
            </div>
          </section>
        )}

        {/* TIP */}
        <div className="adm-tip">
          💡 Tip: Always verify correct answers before publishing results to avoid participant disputes.
        </div>
      </main>
    </div>
  );
}
