import { http } from "../http.js";
export const CommentsAPI = {
  getCommentsByPostId(postId) {
    return http.get(`/posts/comments/${postId}`);
  },
  createCommentByPostId(postId, newComment) {
    return http.post(`/posts/comments/${postId}`, newComment);
  },
  deleteCommentByCommentId(commentId) {
    return http.delete(`/posts/comments/${commentId}`);
  },
};
