import { http } from "../http.js";
export const UsersAPI = {
  getUserSavedPosts() {
    return http.get("/users/saved", { _withAuth: true });
  },
  savePost(postId) {
    return http.patch("/users/save", { postId }, { _withAuth: true });
  },
};
