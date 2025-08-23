import { http } from "../http.js";
export const CommentsAPI = {
  getCommentsByPostId(postId) {
    return http.get(`/comments/${postId}`, { _withAuth: false });
  },
  createCommentByPostId(postId, newComment) {
    return http.post(`/comments/${postId}`, newComment, {
      _withAuth: true,
    });
  },
  deleteCommentByCommentId(commentId) {
    return http.delete(`/comments/${commentId}`, { _withAuth: true });
  },
};
