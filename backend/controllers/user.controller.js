import User from "../models/user.model.js";

export const getUserSavedPosts = async (req, res) => {
  //   console.log("req.auth:", req.auth());

  // verify that the user is authenticated
  const clerkUserId = req.auth().userId;
  if (!clerkUserId) {
    return res
      .status(401)
      .json({ message: "Unauthorized in getUserSavedPosts" });
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user.savedPosts);
};

export const savePost = async (req, res) => {
  // verify that the user is authenticated
  const clerkUserId = req.auth().userId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in savePost" });
  }

  //   console.log("clerkUserId:", clerkUserId);

  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { postId } = req.body;
  if (!postId) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  //   console.log("user savedPosts:", user.savedPosts);

  // Check if postId is already in user's savedPosts
  const isSaved = user.savedPosts.some((p) => {
    // console.log("Checking saved post:", p, "against postId:", postId);

    return p === postId;
  });
  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, { $push: { savedPosts: postId } });
  } else {
    await User.findByIdAndUpdate(user._id, { $pull: { savedPosts: postId } });
  }
  res
    .status(200)
    .json(isSaved ? "Post unsaved successfully" : "Post saved successfully");
};
