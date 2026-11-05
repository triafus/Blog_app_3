const { pool } = require("../config/db");

exports.getCommentsByArticle = async (req, res) => {
  try {
    const articleId = req.params.articleId || req.params.id;
    const [rows] = await pool.query(
      `SELECT comments.*, users.username, users.avatar 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE comments.article_id = ?
       ORDER BY comments.created_at ASC`,
      [articleId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { article_id, content } = req.body;
    const [result] = await pool.query(
      "INSERT INTO comments (article_id, content, user_id) VALUES (?, ?, ?)",
      [article_id, content, req.userId]
    );
    res.status(201).json({
      id: result.insertId,
      article_id,
      content,
      user_id: req.userId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const [comments] = await pool.query(
      "SELECT * FROM comments WHERE id = ?",
      [req.params.id]
    );

    if (comments.length === 0)
      return res.status(404).json({ message: "Comment not found" });
    if (comments[0].user_id !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    await pool.query("UPDATE comments SET content = ? WHERE id = ?", [
      content,
      req.params.id,
    ]);

    res.json({ message: "Comment updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const [comments] = await pool.query(
      "SELECT * FROM comments WHERE id = ?",
      [req.params.id]
    );

    if (comments.length === 0)
      return res.status(404).json({ message: "Comment not found" });
    if (comments[0].user_id !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    await pool.query("DELETE FROM comments WHERE id = ?", [req.params.id]);
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
