import apiClient from '../../api/api';

const endpointMap = {
  comments: (type, slug) => `/api/v1/${type}/${slug}/comments/`,
  commentDetail: (type, id) => `/api/v1/${type}/comments/${id}/`,

  reviews: (type, slug) => `/api/v1/${type}/${slug}/reviews/`,
  reviewDetail: (type, id) => `/api/v1/${type}/reviews/${id}/`,

  rate: (type, slug) => `/api/v1/${type}/${slug}/rate/`,
};

const engagementService = {
  // 💬 Comments
  fetchComments: (type, slug) => apiClient.get(endpointMap.comments(type, slug)),
  postComment: (type, slug, data) => apiClient.post(endpointMap.comments(type, slug), data),
  updateComment: (type, id, data) => apiClient.put(endpointMap.commentDetail(type, id), data),
  deleteComment: (type, id) => apiClient.delete(endpointMap.commentDetail(type, id)),

  // 📝 Reviews
  fetchReviews: (type, slug) => apiClient.get(endpointMap.reviews(type, slug)),
  postReview: (type, slug, formData) =>
    apiClient.post(endpointMap.reviews(type, slug), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // ⭐ Rating
  rateItem: (type, slug, ratingData) =>
    apiClient.post(endpointMap.rate(type, slug), ratingData),
};

export default engagementService;
