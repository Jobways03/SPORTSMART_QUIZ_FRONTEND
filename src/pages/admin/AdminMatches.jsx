import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminFetchMatches,
  adminCreateMatch,
  adminUpdateMatchStatus,
  adminDeleteMatchStatus,
} from "../../services/adminMatch.service";
import "../../styles/admin-matches.css";

/* Convert datetime-local → ISO */
function toISOFromDateTimeLocal(value) {
  return new Date(value).toISOString();
}

export default function AdminMatches() {
  const navigate = useNavigate();

  /* LIST STATE */
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  /* CREATE FORM STATE */
  const [title, setTitle] = useState("");
  const [tournament, setTournament] = useState("");
  const [startTimeLocal, setStartTimeLocal] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [creating, setCreating] = useState(false);

  /* UI STATE */
  const [openMenuId, setOpenMenuId] = useState(null);

  /* LOAD MATCHES */
  const loadMatches = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await adminFetchMatches();
      setMatches(Array.isArray(data) ? data : data.matches || []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  /* CREATE MATCH */
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) return setErrorMsg("Match title is required");
    if (!startTimeLocal) return setErrorMsg("Start time is required");

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("tournament", tournament.trim());
      formData.append("startTime", toISOFromDateTimeLocal(startTimeLocal));
      if (coverImage) formData.append("coverImage", coverImage);

      await adminCreateMatch(formData);

      setTitle("");
      setTournament("");
      setStartTimeLocal("");
      setCoverImage(null);
      setPreview(null);

      await loadMatches();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  /* UPDATE STATUS */
  const handleStatusChange = async (id, status) => {
    await adminUpdateMatchStatus(id, status);
    await loadMatches();
  };

  /* DELETE MATCH */
  const handleDeleteMatch = async (id) => {
    await adminDeleteMatchStatus(id);
    await loadMatches();
  };

  return (
    <div className="admin-matches-page">
      <div className="admin-matches-container">
        <Link to="/admin/dashboard" className="admin-back-link">
          ← Back to Dashboard
        </Link>

        <h1 className="admin-page-title">Match Management</h1>

        {/* CREATE MATCH */}
        <form className="admin-create-card" onSubmit={handleCreateMatch}>
          <h2 className="admin-section-title">Create Match</h2>

          {errorMsg && <div className="admin-alert-error">{errorMsg}</div>}

          <input
            className="admin-input"
            placeholder="Match title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="admin-input"
            placeholder="Tournament"
            value={tournament}
            onChange={(e) => setTournament(e.target.value)}
          />

          <input
            className="admin-input"
            type="datetime-local"
            value={startTimeLocal}
            onChange={(e) => setStartTimeLocal(e.target.value)}
          />

          <input
            className="admin-input-file"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setCoverImage(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview && (
            <img src={preview} alt="Preview" className="admin-image-preview" />
          )}

          <button className="admin-btn-primary" disabled={creating}>
            {creating ? "Creating…" : "Create Match"}
          </button>
        </form>

        {/* MATCH LIST */}
        <div className="admin-list-section">
          <div className="admin-list-header">
            <h2 className="admin-section-title">All Matches</h2>
            <button className="admin-btn-primary" onClick={loadMatches}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="admin-info-box">Loading matches…</div>
          ) : matches.length === 0 ? (
            <div className="admin-info-box">No matches found</div>
          ) : (
            matches.map((m) => {
              const id = m._id || m.id;

              return (
                <div key={id} className="admin-match-card">
                  {m.coverImage && (
                    <img
                      src={m.coverImage}
                      alt={m.title}
                      className="admin-match-cover"
                    />
                  )}

                  <div className="admin-match-details">
                    <div className="admin-match-title">{m.title}</div>
                    <div className="admin-match-meta">
                      {new Date(m.startTime).toLocaleString()}
                      {m.tournament && ` • ${m.tournament}`}
                    </div>
                    <div className="admin-match-status">
                      Status: <b>{m.status}</b>
                    </div>
                  </div>

                  <div className="admin-match-actions">
                    <select
                      className="admin-select"
                      value={m.status}
                      onChange={(e) => handleStatusChange(id, e.target.value)}
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LIVE">LIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <button
                      className="admin-btn-secondary"
                      onClick={() => navigate(`/admin/quizzes/${id}`)}
                    >
                      Manage Quiz
                    </button>

                    <button
                      className="admin-btn-danger"
                      onClick={() => handleDeleteMatch(id)}
                    >
                      Delete
                    </button>

                    <div className="admin-action-menu">
                      <button
                        className="admin-kebab-btn"
                        onClick={() =>
                          setOpenMenuId(openMenuId === id ? null : id)
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === id && (
                        <div className="admin-dropdown">
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
