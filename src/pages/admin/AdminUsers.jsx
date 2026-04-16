import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchAdminUsers } from "../../services/adminUsers.service";
import "../../styles/admin-users.css";

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}


export default function AdminUsers() {
  const [users, setUsers]   = useState([]);
  const [q, setQ]           = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    fetchAdminUsers()
      .then(setUsers)
      .catch((e) => setError(e?.response?.data?.message || "Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(needle) ||
        (u.phone || "").includes(needle) ||
        (u.email || "").toLowerCase().includes(needle)
    );
  }, [users, q]);

  const totalAttempts  = users.reduce((s, u) => s + u.attempts, 0);
  const totalScore     = users.reduce((s, u) => s + u.totalScore, 0);
  const activeUsers    = users.filter((u) => u.attempts > 0).length;

  return (
    <div className="au-page">
      {/* ── HEADER ── */}
      <div className="au-header">
        <div>
          <div className="au-title">Users</div>
          <div className="au-sub">{users.length} registered participants</div>
        </div>
        <Link to="/admin/dashboard" className="au-back-btn">← Back</Link>
      </div>

      {/* ── SUMMARY STRIP ── */}
      {!loading && !error && (
        <div className="au-summary">
          <div className="au-summary-card">
            <div className="au-summary-val">{users.length}</div>
            <div className="au-summary-label">Total Users</div>
          </div>
          <div className="au-summary-card">
            <div className="au-summary-val">{activeUsers}</div>
            <div className="au-summary-label">Played at least once</div>
          </div>
          <div className="au-summary-card">
            <div className="au-summary-val">{totalAttempts}</div>
            <div className="au-summary-label">Total Attempts</div>
          </div>
          <div className="au-summary-card">
            <div className="au-summary-val">{totalScore}</div>
            <div className="au-summary-label">Total Points Scored</div>
          </div>
        </div>
      )}

      {/* ── SEARCH ── */}
      <div className="au-search-row">
        <input
          className="au-search"
          placeholder="Search by name, phone or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* ── STATES ── */}
      {loading && (
        <div className="au-skeleton-wrap">
          {[1,2,3,4,5].map((i) => <div key={i} className="au-skeleton-row" />)}
        </div>
      )}
      {error && <div className="au-error">{error}</div>}

      {/* ── TABLE ── */}
      {!loading && !error && (
        <div className="au-table-card">
          {filtered.length === 0 ? (
            <div className="au-empty">No users found.</div>
          ) : (
            <div className="au-table-wrap">
              <table className="au-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Joined</th>
                    <th style={{ textAlign: "center" }}>Attempts</th>
                    <th style={{ textAlign: "right" }}>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u._id}>
                      <td className="au-td-num">{i + 1}</td>
                      <td>
                        <div className="au-user-row">
                          <div className="au-avatar">
                            {(u.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="au-name">{u.name || "—"}</span>
                        </div>
                      </td>
                      <td className="au-contact">
                        {u.phone || u.email || "—"}
                      </td>
                      <td className="au-joined">{fmt(u.joinedAt)}</td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`au-badge ${u.attempts > 0 ? "au-badge--active" : "au-badge--zero"}`}>
                          {u.attempts}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className="au-score">{u.totalScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
