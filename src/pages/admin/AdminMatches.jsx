import React, { useEffect, useMemo, useState } from "react";
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

function formatLocalDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || "-";
  }
}

function getInitials(text = "") {
  const parts = String(text).trim().split(" ").filter(Boolean);
  if (!parts.length) return "SP";
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
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

  /* LOAD MATCHES (same as your previous functionality) */
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

  /* Close dropdown on outside click */
  useEffect(() => {
    const onDown = (e) => {
      if (!openMenuId) return;
      if (e.target.closest(".admin-action-menu")) return;
      setOpenMenuId(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenuId]);

  /* Close dropdown on ESC */
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  /* Cleanup preview URL */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* CREATE MATCH (same functionality, better cleanup) */
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) return setErrorMsg("Match title is required");
    if (!startTimeLocal) return setErrorMsg("Start time is required");

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("tournament", tournament.trim()); // optional (same as before)
      formData.append("startTime", toISOFromDateTimeLocal(startTimeLocal));
      if (coverImage) formData.append("coverImage", coverImage);

      await adminCreateMatch(formData);

      setTitle("");
      setTournament("");
      setStartTimeLocal("");
      setCoverImage(null);

      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);

      await loadMatches();
    } catch (e2) {
      setErrorMsg(e2?.response?.data?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  /* UPDATE STATUS (same as previous functionality) */
  const handleStatusChange = async (id, status) => {
    await adminUpdateMatchStatus(id, status);
    await loadMatches();
  };

  /* DELETE MATCH (same as previous functionality) */
  const handleDeleteMatch = async (id) => {
    await adminDeleteMatchStatus(id);
    await loadMatches();
  };

  const list = useMemo(() => {
    return [...matches].sort((a, b) => {
      const ta = new Date(a.startTime || 0).getTime();
      const tb = new Date(b.startTime || 0).getTime();
      return tb - ta;
    });
  }, [matches]);

  return (
    <div className="admin-matches-page">
      <div className="admin-matches-container">
        {/* TOP BAR */}
        <div className="admin-matches-top">
          <div className="admin-matches-top-left">
            <Link to="/admin/dashboard" className="admin-back-link">
              ← Back to Dashboard
            </Link>
            <h1 className="admin-page-title">Match Management</h1>
          </div>

          <button
            type="button"
            className="admin-btn-primary"
            onClick={loadMatches}
          >
            Refresh
          </button>
        </div>

        {/* CREATE MATCH (better UI, same functionality) */}
        <form className="admin-create-card" onSubmit={handleCreateMatch}>
          <div className="admin-card-head">
            <h2 className="admin-section-title">Create Match</h2>
            <p className="admin-card-subtitle">
              Add match details and upload a cover image
            </p>
          </div>

          {errorMsg && <div className="admin-alert-error">{errorMsg}</div>}

          <div className="admin-form-grid">
            <div className="admin-field">
              <label className="admin-label" htmlFor="matchTitle">
                Match Title <span className="admin-required">*</span>
              </label>
              <input
                id="matchTitle"
                className="admin-input"
                placeholder="Eg: IND vs PAK"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="tournament">
                Tournament <span className="admin-required">*</span>
              </label>
              <input
                id="tournament"
                className="admin-input"
                placeholder="Eg: T20I World Cup"
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="startTime">
                Start Time <span className="admin-required">*</span>
              </label>
              <input
                id="startTime"
                className="admin-input"
                type="datetime-local"
                value={startTimeLocal}
                onChange={(e) => setStartTimeLocal(e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="coverImage">
                Cover Image <span className="admin-required">*</span>
              </label>

              <div className="admin-file-row">
                <input
                  id="coverImage"
                  className="admin-input-file"
                  type="file"
                  accept="image/*"
                  disabled={creating}
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (preview) URL.revokeObjectURL(preview);
                    setCoverImage(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
                <div className="admin-file-hint">
                  {coverImage?.name
                    ? coverImage.name
                    : "PNG/JPG/WebP preferred"}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-create-footer">
            <div className="admin-preview-wrap">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="admin-image-preview"
                />
              ) : (
                <div className="admin-image-placeholder">
                  <div className="ph-icon">🖼️</div>
                  <div className="ph-title">No cover selected</div>
                  <div className="ph-sub">Upload an image to preview</div>
                </div>
              )}
            </div>

            <button
              className="admin-btn-primary admin-btn-wide"
              disabled={creating}
            >
              {creating ? "Creating…" : "Create Match"}
            </button>
          </div>
        </form>

        {/* MATCH LIST */}
        <div className="admin-list-section">
          <div className="admin-list-header">
            <h2 className="admin-section-title">All Matches</h2>
            <div className="admin-list-sub">
              {loading ? "Loading…" : `${list.length} matches`}
            </div>
          </div>

          {loading ? (
            <div className="admin-info-box">Loading matches…</div>
          ) : list.length === 0 ? (
            <div className="admin-info-box">No matches found</div>
          ) : (
            <div className="admin-match-list">
              {list.map((m) => {
                const id = m._id || m.id;
                const hasCover = Boolean(m.coverImage);
                const initials = getInitials(
                  m.title || m.tournament || "Match",
                );

                return (
                  <div key={id} className="admin-match-card">
                    {/* COVER (with backup placeholder) */}
                    <div className="admin-match-coverwrap">
                      {hasCover ? (
                        <img
                          src={m.coverImage}
                          alt={m.title}
                          className="admin-match-cover"
                        />
                      ) : (
                        <div className="admin-match-cover-fallback">
                          <div className="fallback-badge">{initials}</div>
                          <div className="fallback-text">No Cover</div>
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="admin-match-details">
                      <div className="admin-match-title">
                        {m.title || "Untitled"}
                      </div>

                      <div className="admin-match-meta">
                        {formatLocalDateTime(m.startTime)}
                        {m.tournament ? ` • ${m.tournament}` : ""}
                      </div>

                      <div className="admin-match-status">
                        Status: <b>{m.status}</b>
                      </div>
                    </div>

                    {/* ACTIONS (same behavior as previous) */}
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
                        type="button"
                        className="admin-btn-secondary"
                        onClick={() => navigate(`/admin/quizzes/${id}`)}
                      >
                        Manage Quiz
                      </button>

                      <button
                        type="button"
                        className="admin-btn-danger"
                        onClick={() => handleDeleteMatch(id)}
                      >
                        Delete
                      </button>

                      <div className="admin-action-menu">
                        <button
                          type="button"
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
                              type="button"
                              onClick={() =>
                                navigate(`/admin/matches/${id}/answers`)
                              }
                            >
                              Set Answers
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/matches/${id}/score`)
                              }
                            >
                              Score Quiz
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/matches/${id}/publish`)
                              }
                            >
                              Publish Results
                            </button>

                            {/* SAME AS YOUR PREVIOUS: no disabling */}
                            <button
                              type="button"
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
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
