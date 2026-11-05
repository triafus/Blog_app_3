import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Edit2, Trash2, User } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";

const CommentList = ({ comments = [], onCommentUpdated, onCommentDeleted }) => {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Assainissement anti-XSS et support des formats HTML / Markdown / Texte
  const renderContent = (rawText) => {
    if (!rawText) return "";
    const parsedHtml = marked.parse(rawText);
    return DOMPurify.sanitize(parsedHtml);
  };

  // Préparation de la mise à jour : PUT /api/comments/:id
  const handleSaveUpdate = (id) => {
    if (!editContent.trim()) return;

    // Futur appel API : PUT /api/comments/:id avec { content: editContent }
    if (onCommentUpdated) {
      onCommentUpdated(id, editContent);
    }
    setEditingId(null);
  };

  // Préparation de la suppression : DELETE /api/comments/:id
  const handleDelete = (id) => {
    // Futur appel API : DELETE /api/comments/:id
    if (onCommentDeleted) {
      onCommentDeleted(id);
    }
  };

  if (comments.length === 0) {
    return (
      <div
        className="glass"
        style={{
          padding: "30px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        Aucun commentaire pour le moment. Soyez le premier à réagir !
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {comments.map((comment) => {
        const isOwner = user && user.id === comment.user_id;
        const isEditing = editingId === comment.id;

        return (
          <div key={comment.id} className="glass" style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {comment.avatar ? (
                  <img
                    src={`http://localhost:5030${comment.avatar}`}
                    alt={comment.username}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <User size={18} />
                )}
                <span style={{ fontWeight: "bold" }}>{comment.username}</span>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>

              {isOwner && !isEditing && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                    }}
                    style={{
                      background: "transparent",
                      color: "var(--text-muted)",
                    }}
                    title="Modifier"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    style={{ background: "transparent", color: "#ef4444" }}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div>
                <textarea
                  rows="3"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn glass"
                    style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSaveUpdate(comment.id)}
                    className="btn btn-primary"
                    style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{ lineHeight: "1.6", fontSize: "0.95rem" }}
                dangerouslySetInnerHTML={{
                  __html: renderContent(comment.content),
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
