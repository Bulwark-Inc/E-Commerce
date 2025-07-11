import { useState } from 'react';

const CommentForm = ({ onSubmit, loading = false }) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="w-full p-3 border border-gray-300 rounded bg-white text-black"
        rows={2}
        disabled={loading}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !content.trim()}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </div>
  );
};

export default CommentForm;