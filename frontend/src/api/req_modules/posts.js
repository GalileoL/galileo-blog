import { http } from "../http.js";
export const PostsAPI = {
  uploadAuth() {
    return http.post("/posts/upload-auth");
  },
  getPosts(params) {
    console.log("Fetching posts with params:", params);

    return http.get("/posts", {
      params: params,
      _withAuth: false, // Assuming posts can be fetched without auth
    });
  },
  getPostBySlug(slug) {
    return http.get(`/posts/${slug}`, { _withAuth: false });
  },
  createPost(newPost) {
    return http.post("/posts", newPost, { _withAuth: true });
  },
  deletePost(id) {
    return http.delete(`/posts/${id}`, { _withAuth: true });
  },
  featurePost(postId) {
    return http.patch(
      "/posts/feature",
      {
        postId: postId,
      },
      { _withAuth: true }
    );
  },
};
