import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import API from '../api/axios';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/comments/article/${articleId}`);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  const handleCommentCreated = async (content) => {
    try {
      await API.post('/comments', { article_id: articleId, content });
      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentUpdated = async (commentId, content) => {
    try {
      await API.put(`/comments/${commentId}`, { content });
      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentDeleted = async (commentId) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
      try {
        await API.delete(`/comments/${commentId}`);
        await fetchComments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section style={{ marginTop: '50px', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <MessageSquare size={24} color="var(--primary)" />
        <h2 style={{ fontSize: '1.6rem' }}>Commentaires ({comments.length})</h2>
      </div>

      <CommentForm
        articleId={articleId}
        onCommentCreated={handleCommentCreated}
      />

      {loading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
          Chargement des commentaires...
        </div>
      ) : (
        <CommentList
          comments={comments}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />
      )}
    </section>
  );
};

export default CommentSection;
