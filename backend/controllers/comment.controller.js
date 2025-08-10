import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getCommentsByPostId = async (req, res) => {
  //   console.log("Fetching comments for postId:", req.params.postId);

  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  //   console.log("Comments for postId:", postId, "Comments:", comments);

  res.status(200).json(comments);
};

export const createCommentByPostId = async (req, res) => {
  // verify that the user is authenticated
  const clerkUserId = req.auth().userId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in createComment" });
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(401).json({ message: "user is not found" });
  }

  const { postId } = req.params;
  //   const { content } = req.body;

  //   if (!content) {
  //     return res.status(400).json({ message: "Content is required" });
  //   }

  const newComment = new Comment({
    ...req.body,
    post: postId,
    user: user._id,
  });
  const comment = await newComment.save();

  // set a timeout to test the comment creation
  setTimeout(() => {
    res.status(201).json(comment);
  }, 3000);
};
export const deleteCommentByCommentId = async (req, res) => {
  // verify that the user is authenticated
  const clerkUserId = req.auth().userId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in createComment" });
  }

  const role = req.auth().sessionClaims?.metadata?.role || "user";
  if (role === "admin") {
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).send("Comment deleted successfully");
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(401).json({ message: "user is not found" });
  }

  const { commentId } = req.params;

  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    user: user._id,
  });
  if (!deletedComment) {
    return res
      .status(403)
      .json({ message: "you can only delete your comment" });
  }
  res.status(200).json({ message: "Comment deleted successfully" });
};
