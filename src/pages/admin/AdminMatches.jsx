import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminFetchMatches,
  adminCreateMatch,
  adminUpdateMatchStatus,
  adminDeleteMatchStatus,
  adminSetWinner,
  adminUpdateCoverImage,
} from "../../services/adminMatch.service";
import "../../styles/admin-matches.css";

/* ── Helpers ─────────────────────────────────────────────────── */
function toISOFromDateTimeLocal(value) {
  return new Date(value).toISOString();
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return iso || "—"; }
}

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return ""; }
}

function getInitials(text = "") {
  const parts = String(text).trim().split(" ").filter(Boolean);
  if (!parts.length) return "SP";
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

/* ── Component ───────────────────────────────────────────────── */
export default function AdminMatches() {
  const navigate = useNavigate();

  /* LIST */
  const [matches, setMatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  /* CREATE FORM */
  const [title, setTitle]                   = useState("");
  const [tournament, setTournament]         = useState("");
  const [startTimeLocal, setStartTimeLocal] = useState("");
  const [coverImage, setCoverImage]         = useState(null);
  const [preview, setPreview]               = useState(null);
  const [creating, setCreating]             = useState(false);

  /* UI */
  const [openMenuId, setOpenMenuId]         = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  /* SET WINNER */
  const [winnerMatchId, setWinnerMatchId]     = useState(null);
  const [winnerName, setWinnerName]           = useState("");
  const [winnerLocation, setWinnerLocation]   = useState("");
  const [winnerPrize, setWinnerPrize]         = useState("");
  const [winnerPhoto, setWinnerPhoto]         = useState(null);
  const [winnerPreview, setWinnerPreview]     = useState(null);
  const [savingWinner, setSavingWinner]       = useState(false);

  /* UPDATE COVER */
  const [coverMatchId, setCoverMatchId]       = useState(null);
  const [newCoverFile, setNewCoverFile]       = useState(null);
  const [newCoverPreview, setNewCoverPreview] = useState(null);
  const [savingCover, setSavingCover]         = useState(false);

  /* ── Load ── */
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

  useEffect(() => { loadMatches(); }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const onDown = (e) => {
      if (!openMenuId) return;
      if (e.target.closest(".am-action-menu")) return;
      setOpenMenuId(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openMenuId]);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") setOpenMenuId(null); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  /* ── Create ── */
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!title.trim()) return setErrorMsg("Match title is required");
    if (!startTimeLocal) return setErrorMsg("Start time is required");
    try {
      setCreating(true);
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("tournament", tournament.trim());
      fd.append("startTime", toISOFromDateTimeLocal(startTimeLocal));
      if (coverImage) fd.append("coverImage", coverImage);
      await adminCreateMatch(fd);
      setTitle(""); setTournament(""); setStartTimeLocal(""); setCoverImage(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      await loadMatches();
    } catch (e2) {
      setErrorMsg(e2?.response?.data?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  /* ── Status ── */
  const handleStatusChange = async (id, status) => {
    await adminUpdateMatchStatus(id, status);
    await loadMatches();
  };

  /* ── Delete ── */
  const handleDeleteMatch = async (id) => {
    try {
      await adminDeleteMatchStatus(id);
      setDeleteConfirmId(null);
      await loadMatches();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Failed to delete match");
    }
  };

  /* ── Winner ── */
  const openWinnerForm = (match) => {
    const id = match._id || match.id;
    setWinnerMatchId(id);
    setWinnerName(match.winner?.name || "");
    setWinnerLocation(match.winner?.location || "");
    setWinnerPrize(match.winner?.prize || "");
    setWinnerPhoto(null);
    if (winnerPreview) URL.revokeObjectURL(winnerPreview);
    setWinnerPreview(match.winner?.photo || null);
    setOpenMenuId(null);
  };

  const closeWinnerForm = () => {
    setWinnerMatchId(null);
    setWinnerName(""); setWinnerLocation(""); setWinnerPrize(""); setWinnerPhoto(null);
    if (winnerPreview && !winnerPreview.startsWith("http")) URL.revokeObjectURL(winnerPreview);
    setWinnerPreview(null);
  };

  const handleSaveWinner = async (e) => {
    e.preventDefault();
    if (!winnerName.trim()) return setErrorMsg("Winner name is required");
    try {
      setSavingWinner(true);
      const fd = new FormData();
      fd.append("winnerName", winnerName.trim());
      fd.append("winnerLocation", winnerLocation.trim());
      fd.append("winnerPrize", winnerPrize.trim());
      if (winnerPhoto) fd.append("winnerPhoto", winnerPhoto);
      await adminSetWinner(winnerMatchId, fd);
      closeWinnerForm();
      await loadMatches();
    } catch (e2) {
      setErrorMsg(e2?.response?.data?.message || "Failed to set winner");
    } finally {
      setSavingWinner(false);
    }
  };

  /* ── Cover ── */
  const openCoverForm = (match) => {
    const id = match._id || match.id;
    setCoverMatchId(id);
    setNewCoverFile(null);
    setNewCoverPreview(match.coverImage || null);
    setOpenMenuId(null);
  };

  const closeCoverForm = () => {
    setCoverMatchId(null);
    setNewCoverFile(null);
    if (newCoverPreview && !newCoverPreview.startsWith("http")) URL.revokeObjectURL(newCoverPreview);
    setNewCoverPreview(null);
  };

  const handleSaveCover = async (e) => {
    e.preventDefault();
    if (!newCoverFile) return setErrorMsg("Please select an image to upload");
    try {
      setSavingCover(true);
      const fd = new FormData();
      fd.append("coverImage", newCoverFile);
      await adminUpdateCoverImage(coverMatchId, fd);
      closeCoverForm();
      await loadMatches();
    } catch (e2) {
      setErrorMsg(e2?.response?.data?.message || "Failed to update cover image");
    } finally {
      setSavingCover(false);
    }
  };

  const list = useMemo(() => {
    return [...matches].sort((a, b) =>
      new Date(b.startTime || 0) - new Date(a.startTime || 0)
    );
  }, [matches]);

  /* ── Render ── */
  return (
    <div className="am-page">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="am-header">
        <div>
          <div className="am-header-title">Match Management</div>
          <div className="am-header-sub">Create, update status, and manage all cricket matches</div>
        </div>
        <div className="am-header-actions">
          <button className="am-refresh-btn" type="button" onClick={loadMatches}>
            ↻ Refresh
          </button>
          <Link to="/admin/dashboard" className="am-back-btn">← Dashboard</Link>
        </div>
      </div>

      {/* ── GLOBAL ERROR ───────────────────────────────────────── */}
      {errorMsg && (
        <div className="am-error-banner">
          ⚠ {errorMsg}
          <button className="am-error-close" onClick={() => setErrorMsg("")}>✕</button>
        </div>
      )}

      {/* ── CREATE MATCH ───────────────────────────────────────── */}
      <form className="am-create-card" onSubmit={handleCreateMatch}>
        <div className="am-create-top">
          <div className="am-create-icon">+</div>
          <div>
            <div className="am-create-title">Create New Match</div>
            <div className="am-create-sub">Fill in the details below to add a new match</div>
          </div>
        </div>

        <div className="am-create-body">
          {/* Fields */}
          <div className="am-form-fields">
            <div className="am-field">
              <label className="am-label" htmlFor="matchTitle">
                Match Title <span className="am-req">*</span>
              </label>
              <input
                id="matchTitle"
                className="am-input"
                placeholder="e.g. IND vs PAK"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="am-field">
              <label className="am-label" htmlFor="tournament">
                Tournament
              </label>
              <input
                id="tournament"
                className="am-input"
                placeholder="e.g. T20I World Cup"
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                disabled={creating}
              />
            </div>

            <div className="am-field">
              <label className="am-label" htmlFor="startTime">
                Start Time <span className="am-req">*</span>
              </label>
              <input
                id="startTime"
                className="am-input"
                type="datetime-local"
                value={startTimeLocal}
                onChange={(e) => setStartTimeLocal(e.target.value)}
                disabled={creating}
                required
              />
            </div>

            <div className="am-field">
              <label className="am-label" htmlFor="coverImg">
                Cover Image
              </label>
              <label className="am-file-label" htmlFor="coverImg">
                <span className="am-file-icon">🖼</span>
                <span className="am-file-text">
                  {coverImage?.name || "Click to choose image (PNG / JPG / WebP)"}
                </span>
                <input
                  id="coverImg"
                  type="file"
                  accept="image/*"
                  disabled={creating}
                  className="am-file-hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (preview) URL.revokeObjectURL(preview);
                    setCoverImage(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />
              </label>
            </div>
          </div>

          {/* Preview panel */}
          <div className="am-preview-panel">
            {preview ? (
              <img src={preview} alt="Preview" className="am-preview-img" />
            ) : (
              <div className="am-preview-placeholder">
                <span className="am-ph-icon">🏏</span>
                <span className="am-ph-text">Cover preview</span>
              </div>
            )}
            <button
              type="submit"
              className="am-btn am-btn--create"
              disabled={creating}
            >
              {creating ? "Creating…" : "✚ Create Match"}
            </button>
          </div>
        </div>
      </form>

      {/* ── MATCH LIST ─────────────────────────────────────────── */}
      <div className="am-list-card">
        <div className="am-list-header">
          <div className="am-list-title">All Matches</div>
          <div className="am-list-count">
            {loading ? "Loading…" : `${list.length} match${list.length !== 1 ? "es" : ""}`}
          </div>
        </div>

        {loading && (
          <div className="am-skeletons">
            {[1,2,3].map((i) => <div key={i} className="am-skeleton" />)}
          </div>
        )}

        {!loading && list.length === 0 && (
          <div className="am-empty">No matches yet. Create one above ↑</div>
        )}

        {!loading && list.length > 0 && (
          <div className="am-match-grid">
            {list.map((m) => {
              const id      = m._id || m.id;
              const status  = m.status || "UNKNOWN";
              const hasCover = Boolean(m.coverImage);
              const initials = getInitials(m.title || "Match");

              return (
                <div key={id} className={`am-match-card${openMenuId === id ? " am-match-card--open" : ""}`}>
                  {/* Cover image */}
                  <div className="am-card-cover">
                    {hasCover ? (
                      <img src={m.coverImage} alt={m.title} className="am-card-img" />
                    ) : (
                      <div className="am-card-img am-card-img--empty">
                        <span className="am-card-initials">{initials}</span>
                        <span className="am-card-no-cover">🏏</span>
                      </div>
                    )}
                    {/* Status chip overlaid on image — top right */}
                    <div className={`am-status am-status--${status.toLowerCase()}`}>
                      {status === "LIVE" && <span className="am-live-dot" />}
                      {status}
                    </div>
                    {/* Published badge — top left */}
                    {m.isResultPublished && (
                      <div className="am-published-tag">✅ Published</div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="am-card-body">
                    <div className="am-match-title">{m.title || "Untitled"}</div>
                    <div className="am-match-meta">
                      📅 {fmtDate(m.startTime)}
                      {fmtTime(m.startTime) ? ` · ${fmtTime(m.startTime)}` : ""}
                    </div>
                    {m.tournament && (
                      <div className="am-match-tournament">🏆 {m.tournament}</div>
                    )}
                    {m.winner?.name && (
                      <div className="am-winner-tag am-winner-tag--set">
                        👑 {m.winner.name}
                        {m.winner.location ? ` · ${m.winner.location}` : ""}
                      </div>
                    )}
                    {m.overrideWinnerName && (
                      <div className="am-winner-tag am-winner-tag--override">
                        🔄 Override: {m.overrideWinnerName}
                      </div>
                    )}
                  </div>

                  {/* Card actions */}
                  <div className="am-card-actions">
                    {/* Status select */}
                    <select
                      className="am-select"
                      value={status}
                      onChange={(e) => handleStatusChange(id, e.target.value)}
                      title="Change status"
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LIVE">LIVE</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>

                    <div className="am-card-btns">
                      {/* Manage Quiz */}
                      <button
                        type="button"
                        className="am-btn am-btn--quiz"
                        onClick={() => navigate(`/admin/quizzes/${id}`)}
                      >
                        📋 Quiz
                      </button>

                      {/* Delete */}
                      {deleteConfirmId === id ? (
                        <div className="am-confirm-row">
                          <button
                            type="button"
                            className="am-btn am-btn--danger-confirm"
                            onClick={() => handleDeleteMatch(id)}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            className="am-btn am-btn--cancel"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="am-btn am-btn--danger"
                          onClick={() => setDeleteConfirmId(id)}
                          title="Delete match"
                        >
                          🗑
                        </button>
                      )}

                      {/* Kebab */}
                      <div className="am-action-menu">
                        <button
                          type="button"
                          className="am-kebab"
                          onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                          title="More actions"
                        >
                          ⋮
                        </button>
                        {openMenuId === id && (
                          <div className="am-dropdown">
                            <div className="am-dropdown-label">Actions</div>
                            <button type="button" onClick={() => navigate(`/admin/matches/${id}/answers`)}>
                              ✅ Set Answers
                            </button>
                            <button type="button" onClick={() => navigate(`/admin/matches/${id}/score`)}>
                              ⚡ Score Quiz
                            </button>
                            <button type="button" onClick={() => navigate(`/admin/matches/${id}/publish`)}>
                              📢 Publish Results
                            </button>
                            <button type="button" onClick={() => navigate(`/admin/matches/${id}/override`)}>
                              🔄 Override Winner
                            </button>
                            <button type="button" onClick={() => navigate(`/admin/matches/${id}/leaderboard`)}>
                              🏆 Leaderboard
                            </button>
                            <div className="am-dropdown-divider" />
                            <button type="button" onClick={() => openWinnerForm(m)}>
                              👑 Set Winner
                            </button>
                            {m.status !== "COMPLETED" && m.status !== "CANCELLED" && (
                            <button type="button" onClick={() => openCoverForm(m)}>
                              🖼 Update Cover
                            </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TIP ────────────────────────────────────────────────── */}
      {!loading && (
        <div className="am-tip">
          💡 Use the <b>⋮ menu</b> on each match to score, publish, set answers, manage leaderboard, and more.
        </div>
      )}

      {/* ── UPDATE COVER MODAL ─────────────────────────────────── */}
      {coverMatchId && (
        <>
          <div className="am-overlay" onClick={closeCoverForm} />
          <div className="am-modal">
            <div className="am-modal-header">
              <div className="am-modal-title">🖼 Update Cover Image</div>
              <button className="am-modal-close" type="button" onClick={closeCoverForm}>✕</button>
            </div>
            <form onSubmit={handleSaveCover}>
              <div className="am-field">
                <label className="am-label">New Cover Image <span className="am-req">*</span></label>
                <label className="am-file-label">
                  <span className="am-file-icon">📁</span>
                  <span className="am-file-text">
                    {newCoverFile?.name || "Choose image to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={savingCover}
                    className="am-file-hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (newCoverPreview && !newCoverPreview.startsWith("http")) URL.revokeObjectURL(newCoverPreview);
                      setNewCoverFile(file);
                      setNewCoverPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
              {newCoverPreview && (
                <img src={newCoverPreview} alt="Cover preview" className="am-modal-img-preview" />
              )}
              <div className="am-modal-actions">
                <button type="submit" className="am-btn am-btn--create" disabled={savingCover || !newCoverFile}>
                  {savingCover ? "Uploading…" : "Save Cover"}
                </button>
                <button type="button" className="am-btn am-btn--cancel" onClick={closeCoverForm} disabled={savingCover}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* ── SET WINNER MODAL ───────────────────────────────────── */}
      {winnerMatchId && (
        <>
          <div className="am-overlay" onClick={closeWinnerForm} />
          <div className="am-modal">
            <div className="am-modal-header">
              <div className="am-modal-title">👑 Set Winner</div>
              <button className="am-modal-close" type="button" onClick={closeWinnerForm}>✕</button>
            </div>
            <form onSubmit={handleSaveWinner}>
              <div className="am-modal-fields">
                <div className="am-field">
                  <label className="am-label">Winner Name <span className="am-req">*</span></label>
                  <input
                    className="am-input"
                    placeholder="e.g. Rahul Sharma"
                    value={winnerName}
                    onChange={(e) => setWinnerName(e.target.value)}
                    disabled={savingWinner}
                    required
                  />
                </div>
                <div className="am-field">
                  <label className="am-label">Location</label>
                  <input
                    className="am-input"
                    placeholder="e.g. Mumbai, India"
                    value={winnerLocation}
                    onChange={(e) => setWinnerLocation(e.target.value)}
                    disabled={savingWinner}
                  />
                </div>
                <div className="am-field">
                  <label className="am-label">What they won</label>
                  <input
                    className="am-input"
                    placeholder="e.g. Amazon Voucher, iPhone 15, ₹500"
                    value={winnerPrize}
                    onChange={(e) => setWinnerPrize(e.target.value)}
                    disabled={savingWinner}
                  />
                </div>
              </div>
              <div className="am-field" style={{ marginTop: 12 }}>
                <label className="am-label">Winner Photo</label>
                <label className="am-file-label">
                  <span className="am-file-icon">📷</span>
                  <span className="am-file-text">
                    {winnerPhoto?.name || "Choose winner photo (optional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={savingWinner}
                    className="am-file-hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (winnerPreview && !winnerPreview.startsWith("http")) URL.revokeObjectURL(winnerPreview);
                      setWinnerPhoto(file);
                      setWinnerPreview(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
              {winnerPreview && (
                <div className="am-winner-photo-wrap">
                  <img src={winnerPreview} alt="Winner" className="am-winner-photo" />
                </div>
              )}
              <div className="am-modal-actions">
                <button type="submit" className="am-btn am-btn--create" disabled={savingWinner}>
                  {savingWinner ? "Saving…" : "Save Winner"}
                </button>
                <button type="button" className="am-btn am-btn--cancel" onClick={closeWinnerForm} disabled={savingWinner}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}

    </div>
  );
}
