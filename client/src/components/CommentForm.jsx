import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Send, User, LogIn } from "lucide-react";

const CommentForm = ({ articleId, onCommentCreated }) => {
  const { user } = useAuth();

  const [content, setContent] = useState("");

  // Préparation de la soumission : POST /api/comments
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Futur appel API : POST /api/comments avec { article_id: articleId, content }
    if (onCommentCreated) {
      onCommentCreated({ content });
    }
    setContent("");
  };

  if (!user) {
    return (
      <div
        className="glass"
        style={{ padding: "20px", textAlign: "center", marginBottom: "30px" }}
      >
        <p style={{ color: "var(--text-muted)", marginBottom: "12px" }}>
          Vous devez être connecté pour participer à la discussion.
        </p>
        <Link
          to="/login"
          className="btn btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
          }}
        >
          <LogIn size={16} /> Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass"
      style={{ padding: "20px", marginBottom: "30px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        {user.avatar ? (
          <img
            src={`http://localhost:5030${user.avatar}`}
            alt={user.username}
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
        ) : (
          <User size={20} />
        )}
        <span style={{ fontWeight: 600 }}>
          Laisser un commentaire en tant que {user.username}
        </span>
      </div>

      <textarea
        rows="3"
        placeholder="Écrivez votre commentaire (Texte, Markdown ou HTML supporté)..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ resize: "vertical" }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Send size={16} /> Publier
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
