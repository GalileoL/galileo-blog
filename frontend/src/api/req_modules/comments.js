import { http } from "../http.js";
export const CommentsAPI = {
  getCommentsByPostId(postId) {
    return http.get(`/posts/comments/${postId}`, { _withAuth: false });
  },
  createCommentByPostId(postId, newComment) {
    return http.post(`/posts/comments/${postId}`, newComment, {
      _withAuth: true,
    });
  },
  deleteCommentByCommentId(commentId) {
    return http.delete(`/posts/comments/${commentId}`, { _withAuth: true });
  },
};
