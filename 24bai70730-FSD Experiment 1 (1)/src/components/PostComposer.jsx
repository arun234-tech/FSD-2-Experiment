import { useState, useEffect, useRef } from "react";
import { validatePost, platformLimits, platformMeta } from "./validationStrategy";
import "./PostComposer.css";

function PostComposer() {
  const [platform, setPlatform] = useState("twitter");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [posted, setPosted] = useState(false);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedDrafts = JSON.parse(localStorage.getItem("drafts")) || [];
    setDrafts(savedDrafts);
  }, []);

  const result = validatePost(content, platform, attachments);
  const limit = platformLimits[platform];
  const meta = platformMeta[platform];
  const usedRatio = Math.min(content.length / limit, 1);

  const persist = (list) => {
    setDrafts(list);
    localStorage.setItem("drafts", JSON.stringify(list));
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
      isImage: f.type.startsWith("image/"),
    }));
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const saveDraft = () => {
    const newDraft = { platform, content, attachments: attachments.length };
    persist([...drafts, newDraft]);
    setContent("");
    setAttachments([]);
  };

  const deleteDraft = (index) => {
    persist(drafts.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (!result.isValid) return;
    setPosting(true);
    setTimeout(() => {
      setPosting(false);
      setPosted(true);
      setContent("");
      setAttachments([]);
      setTimeout(() => setPosted(false), 2200);
    }, 900);
  };

  return (
    <div className="composer-page" style={{ "--accent-gradient": meta.gradient, "--accent-color": meta.color }}>
      <div className="composer-card">
        <header className="composer-header">
          <h1>Compose</h1>
          <p className="composer-sub">One draft, every platform.</p>
        </header>

        <div className="platform-tabs">
          {Object.keys(platformMeta).map((key) => (
            <button
              key={key}
              className={`platform-tab ${platform === key ? "active" : ""}`}
              style={platform === key ? { background: platformMeta[key].gradient } : {}}
              onClick={() => setPlatform(key)}
            >
              {platformMeta[key].label}
            </button>
          ))}
        </div>

        <div className="editor-shell">
          <textarea
            className="editor"
            placeholder={`What's happening on ${meta.label}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {attachments.length > 0 && (
            <div className="attachment-strip">
              {attachments.map((a, i) => (
                <div className="attachment-chip" key={i}>
                  {a.isImage ? (
                    <img src={a.url} alt={a.name} />
                  ) : (
                    <div className="file-icon">📎</div>
                  )}
                  <span className="attachment-name">{a.name}</span>
                  <button className="remove-chip" onClick={() => removeAttachment(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="editor-footer">
            <button className="attach-btn" onClick={() => fileInputRef.current.click()}>
              📎 Attach files
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFiles}
              style={{ display: "none" }}
            />

            <div className="char-meter">
              <svg width="30" height="30" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="12" className="ring-track" />
                <circle
                  cx="15"
                  cy="15"
                  r="12"
                  className="ring-fill"
                  style={{
                    strokeDasharray: 2 * Math.PI * 12,
                    strokeDashoffset: 2 * Math.PI * 12 * (1 - usedRatio),
                    stroke: usedRatio >= 1 ? "#ff4d4f" : meta.color,
                  }}
                />
              </svg>
              <span className={content.length > limit ? "char-count over" : "char-count"}>
                {content.length}/{limit}
              </span>
            </div>
          </div>
        </div>

        {!result.isValid && content.length > 0 && (
          <p className="error-text">{result.error}</p>
        )}

        <div className="action-row">
          <button className="ghost-btn" onClick={saveDraft} disabled={!content && attachments.length === 0}>
            Save draft
          </button>
          <button
            className="post-btn"
            disabled={!result.isValid || posting}
            onClick={handlePost}
          >
            {posting ? "Posting…" : posted ? "Posted ✓" : `Post to ${meta.label}`}
          </button>
        </div>

        <hr className="divider" />

        <h3 className="drafts-title">Saved drafts</h3>

        {drafts.length === 0 && <p className="empty-text">No drafts yet — save one to see it here.</p>}

        <div className="draft-grid">
          {drafts.map((draft, index) => (
            <div
              className="draft-card"
              key={index}
              style={{ borderColor: platformMeta[draft.platform]?.color || "#555" }}
            >
              <div className="draft-tag" style={{ background: platformMeta[draft.platform]?.gradient }}>
                {platformMeta[draft.platform]?.label || draft.platform}
              </div>
              <p className="draft-content">{draft.content || "(no text)"}</p>
              {draft.attachments > 0 && (
                <span className="draft-attach-count">📎 {draft.attachments} file(s)</span>
              )}
              <button className="delete-btn" onClick={() => deleteDraft(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostComposer;
