import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  adminFetchMatches,
  adminSetWinner,
} from "../../services/adminMatch.service";
import "../../styles/admin-set-winner.css";

export default function AdminSetWinner() {
  const { matchId } = useParams();
  const navigate    = useNavigate();

  const [match, setMatch]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]  = useState(false);
  const [error, setError]    = useState("");
  const [success, setSuccess] = useState("");

  /* Form state */
  const [name, setName]         = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const fileRef = useRef();

  /* Load match */
  useEffect(() => {
    adminFetchMatches()
      .then((data) => {
        const list  = Array.isArray(data) ? data : data?.matches || [];
        const found = list.find((m) => (m._id || m.id) === matchId);
        setMatch(found || null);
        if (found?.winner) {
          setName(found.winner.name || "");
          setLocation(found.winner.location || "");
          setPreview(found.winner.photo || null);
        }
      })
      .catch(() => setError("Failed to load match data."))
      .finally(() => setLoading(false));
  }, [matchId]);

  /* Photo pick */
  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    if (preview && !preview.startsWith("http")) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  /* Save */
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name.trim()) return setError("Winner name is required.");

    const fd = new FormData();
    fd.append("winnerName", name.trim());
    fd.append("winnerLocation", location.trim());
    if (photo) fd.append("winnerPhoto", photo);

    try {
      setSaving(true);
      await adminSetWinner(matchId, fd);
      setSuccess("Winner saved successfully!");
      setPhoto(null);
    } catch (e2) {
      setError(e2?.response?.data?.message || "Failed to save winner.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="asw-page">
      {/* ── HEADER ── */}
      <div className="asw-header">
        <div>
          <div className="asw-title">Set Match Winner</div>
          <div className="asw-sub">
            {loading ? "Loading…" : match ? `${match.title}${match.tournament ? ` · ${match.tournament}` : ""}` : "Match not found"}
          </div>
        </div>
        <Link to="/admin/matches" className="asw-back-btn">← Back to Matches</Link>
      </div>

      {/* ── CARD ── */}
      <div className="asw-card">
        {loading && <div className="asw-loading">Loading match data…</div>}
        {!loading && !match && (
          <div className="asw-error-box">Match not found. Please go back and try again.</div>
        )}

        {!loading && match && (
          <form className="asw-form" onSubmit={handleSave}>
            {error   && <div className="asw-alert asw-alert--error">{error}</div>}
            {success && (
              <div className="asw-alert asw-alert--success">
                {success}
                <button type="button" className="asw-goto-btn" onClick={() => navigate("/admin/quiz-hub")}>
                  ← Back to Quiz Hub
                </button>
              </div>
            )}

            {/* Photo upload */}
            <div className="asw-photo-section">
              <div
                className="asw-photo-preview"
                onClick={() => fileRef.current?.click()}
                title="Click to change photo"
              >
                {preview ? (
                  <img src={preview} alt="Winner" className="asw-photo-img" />
                ) : (
                  <div className="asw-photo-placeholder">
                    <span>👑</span>
                    <div>Click to upload photo</div>
                  </div>
                )}
                <div className="asw-photo-overlay">Change</div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onPhoto}
              />
              <div className="asw-photo-hint">PNG / JPG / WebP preferred</div>
            </div>

            {/* Name */}
            <div className="asw-field">
              <label className="asw-label">
                Winner Name <span className="asw-required">*</span>
              </label>
              <input
                className="asw-input"
                type="text"
                placeholder="e.g. India, Virat Kohli…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                required
              />
            </div>

            {/* Location */}
            <div className="asw-field">
              <label className="asw-label">Location / Team</label>
              <input
                className="asw-input"
                type="text"
                placeholder="e.g. Mumbai, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={saving}
              />
            </div>

            {/* Current winner badge */}
            {match.winner?.name && (
              <div className="asw-current">
                <span className="asw-current-label">Current winner:</span>
                <b>{match.winner.name}</b>
                {match.winner.location && <span className="asw-current-loc">· {match.winner.location}</span>}
              </div>
            )}

            <div className="asw-divider" />

            <div className="asw-actions">
              <button
                type="submit"
                className="asw-btn asw-btn--primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "💾 Save Winner"}
              </button>
              <Link to="/admin/quiz-hub" className="asw-btn asw-btn--ghost">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
