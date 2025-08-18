import { http } from "../http.js";
export const UsersAPI = {
  getUserSavedPosts() {
    return http.get("/users/saved");
  },
  savePost(postId) {
    return http.patch("/users/save", { postId });
  },
};
