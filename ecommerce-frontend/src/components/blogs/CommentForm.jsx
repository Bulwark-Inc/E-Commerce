import { useState } from 'react';
import blogService from '../../services/blogService';
import toast from 'react-hot-toast';

const CommentForm = ({ postSlug }) => {
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authorName || !content) return toast.error('Please fill out all fields.');

    setSubmitting(true);
    try {
      await blogService.createComment(postSlug, { author_name: authorName, content });
      toast.success('Comment submitted!');
      setAuthorName('');
      setContent('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        placeholder="Your name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
      />
      <textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
