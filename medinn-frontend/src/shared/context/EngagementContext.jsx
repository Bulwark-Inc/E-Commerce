import { createContext, useContext, useEffect, useState } from 'react';
import engagementService from '../services/engagementService';

export const EngagementContext = createContext();

export const EngagementProvider = ({ type, slug, children }) => {
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState({
    comments: false,
    reviews: false,
    rating: false,
  });
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading((prev) => ({ ...prev, comments: true }));
    try {
      const { data } = await engagementService.fetchComments(type, slug);
      setComments(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, comments: false }));
    }
  };

  const addComment = async (content) => {
    await engagementService.postComment(type, slug, { content });
    await fetchComments();
  };

  const updateComment = async (id, content) => {
    await engagementService.updateComment(type, id, { content });
    await fetchComments();
  };

  const deleteComment = async (id) => {
    await engagementService.deleteComment(type, id);
    await fetchComments();
  };

  const fetchReviews = async () => {
    setLoading((prev) => ({ ...prev, reviews: true }));
    try {
      const { data } = await engagementService.fetchReviews(type, slug);
      setReviews(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, reviews: false }));
    }
  };

  const addReview = async (formData) => {
    await engagementService.postReview(type, slug, formData);
    await fetchReviews();
  };

  const rate = async (value) => {
    setLoading((prev) => ({ ...prev, rating: true }));
    try {
      await engagementService.rateItem(type, slug, { value });
      await fetchReviews(); // or refetch the full product/item if needed
    } catch (err) {
      setError(err);
    } finally {
      setLoading((prev) => ({ ...prev, rating: false }));
    }
  };

  useEffect(() => {
    if (slug) {
      fetchComments();
      fetchReviews();
    }
  }, [slug]);

  const value = {
    comments,
    reviews,
    averageRating,
    loading,
    error,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    fetchReviews,
    addReview,
    rate,
  };

  return (
    <EngagementContext.Provider value={value}>
      {children}
    </EngagementContext.Provider>
  );
};
