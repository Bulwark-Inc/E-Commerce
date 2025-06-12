const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) return <p>No comments yet. Be the first!</p>;

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p><strong>{comment.author_name}</strong> said:</p>
          <p>{comment.content}</p>
          <span className="comment-date">{comment.created_at}</span>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
