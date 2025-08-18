import { http } from "../http.js";
export const PostsAPI = {
  uploadAuth() {
    return http.post("/posts/upload-auth");
  },
  getPosts(params) {
    return http.get("/posts", {
      params: params,
    });
  },
  getPostBySlug(slug) {
    return http.get(`/posts/${slug}`);
  },
  createPost(newPost) {
    return http.post("/posts", newPost);
  },
  deletePost(id) {
    return http.delete(`/posts/${id}`);
  },
  featurePost(postId) {
    return http.patch("/posts/feature", {
      postId: postId,
    });
  },
};
