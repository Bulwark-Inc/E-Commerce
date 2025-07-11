const CommentList = ({ comments, loading }) => {
  if (loading) return <p className="text-sm text-gray-400">Loading comments...</p>;

  if (!comments.length) {
    return <p className="text-gray-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-4 mb-6">
      {comments.map((c) => (
        <div key={c.id} className="p-3 bg-gray-100 rounded text-black">
          <p className="font-medium">{c.username}</p>
          <p>{c.content}</p>
          <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
