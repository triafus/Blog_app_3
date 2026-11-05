import { useState } from "react";
import { MessageSquare } from "lucide-react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const CommentSection = ({ articleId }) => {
  // État des commentaires (initialisé vide en l'attente des appels API réels)
  const [comments, setComments] = useState([]);

  // Préparation du chargement : GET /api/comments/article/:id
  // useEffect(() => { ... }, [articleId]);

  const handleCommentCreated = (newCommentData) => {
    // Logique d'ajout local ou rechargement suite au POST /api/comments
  };

  const handleCommentUpdated = (commentId, updatedContent) => {
    // Logique de mise à jour locale ou rechargement suite au PUT /api/comments/:id
  };

  const handleCommentDeleted = (commentId) => {
    // Logique de suppression locale ou rechargement suite au DELETE /api/comments/:id
  };

  return (
    <section
      style={{
        marginTop: "50px",
        borderTop: "1px solid var(--border)",
        paddingTop: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <MessageSquare size={24} color="var(--primary)" />
        <h2 style={{ fontSize: "1.6rem" }}>Commentaires ({comments.length})</h2>
      </div>
      <CommentForm
        articleId={articleId}
        onCommentCreated={handleCommentCreated}
      />
      <CommentList
        comments={comments}
        onCommentUpdated={handleCommentUpdated}
        onCommentDeleted={handleCommentDeleted}
      />
    </section>
  );
};

export default CommentSection;
