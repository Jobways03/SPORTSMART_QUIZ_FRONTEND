import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminFetchMatches,
  adminCreateMatch,
  adminUpdateMatchStatus,
  adminDeleteMatchStatus,
} from "../../services/adminMatch.service";
import "../../styles/admin-matches.css";

function toISOFromDateTimeLocal(value) {
  return new Date(value).toISOString();
}

export default function AdminMatches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [tournament, setTournament] = useState("");
  const [startTimeLocal, setStartTimeLocal] = useState("");
  const [creating, setCreating] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminFetchMatches();
      console.log(data);
      
      setMatches(Array.isArray(data) ? data : data.matches || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Match title is required");
    if (!startTimeLocal) return setError("Start time is required");

    try {
      setCreating(true);
      await adminCreateMatch({
        title: title.trim(),
        tournament: tournament.trim(),
        startTime: toISOFromDateTimeLocal(startTimeLocal),
      });
      setTitle("");
      setTournament("");
      setStartTimeLocal("");
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const onStatusChange = async (id, status) => {
    await adminUpdateMatchStatus(id, status);
    await load();
  };

  const deleteMatch = async (id) => {
    await adminDeleteMatchStatus(id);
    await load();
  };

  return (
    <div className="admin-page-wrapper">
      <div className="admin-content">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1 className="admin-title">Match Management</h1>

        {/* CREATE MATCH */}
        <form className="create-card" onSubmit={onCreate}>
          <h2>Create Match</h2>

          {error && <div className="admin-error">{error}</div>}

          <input
            placeholder="Match title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            placeholder="Tournament"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
          />

          <input
            type="datetime-local"
            value={startTimeLocal}
            onChange={(e) => setStartTimeLocal(e.target.value)}
          />

          <button className="primary-btn" disabled={creating}>
            {creating ? "Creating…" : "Create Match"}
          </button>
        </form>

        {/* MATCH LIST */}
        <div className="list-section">
          <div className="list-header">
            <h2>All Matches</h2>
            <button className="primary-btn" onClick={load}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="info-box">Loading matches…</div>
          ) : matches.length === 0 ? (
            <div className="info-box">No matches found</div>
          ) : (
            matches.map((m) => {
              const id = m._id || m.id;
              return (
                <div key={id} className="match-card">
                  <div className="match-left">
                    <div className="match-title">{m.title}</div>
                    <div className="match-meta">
                      {new Date(m.startTime).toLocaleString()}
                      {m.tournament && ` • ${m.tournament}`}
                    </div>
                    <div className="match-status">
                      Status: <span>{m.status}</span>
                    </div>
                  </div>

                  <div className="match-right">
                    <select
                      value={m.status}
                      onChange={(e) => onStatusChange(id, e.target.value)}
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LIVE">LIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <button
                      className="primary-btn small"
                      onClick={() => navigate(`/admin/quizzes/${id}`)}
                    >
                      Manage Quiz
                    </button>
                    <button
                      style={{ background: "red" }}
                      className="primary-btn small"
                      onClick={() => {
                        deleteMatch(id);
                      }}
                    >
                      Delete
                    </button>

                    <div className="action-menu">
                      <button
                        className="kebab-btn"
                        onClick={() => setOpenMenu(openMenu === id ? null : id)}
                      >
                        ⋮
                      </button>

                      {openMenu === id && (
                        <div className="menu-dropdown">
                          <button
                            onClick={() =>
                              navigate(`/admin/matches/${id}/answers`)
                            }
                          >
                            Set Answers
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/matches/${id}/score`)
                            }
                          >
                            Score Quiz
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/matches/${id}/publish`)
                            }
                          >
                            Publish Results
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/leaderboard/${m.quizId}`)
                            }
                          >
                            View Leaderboard
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
