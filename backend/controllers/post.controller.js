import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const posts = await Post.find();
  res.status(200).send(posts);
};

export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug });
  res.status(200).send(post);
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in createPost" });
  }

  // const user = await User.findOne({ clerkId: clerkUserId });
  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a slug from the title
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });
  let counter = 2;
  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = await Post.create({
    ...req.body,
    slug,
    user: user._id,
  });
  const post = await newPost.save();
  res.status(201).send(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  console.log(clerkUserId);
  console.log(req.auth());
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in deletePost" });
  }

  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletePost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletePost) {
    return res.status(403).json({ message: "you can only delete your post" });
  }

  res.status(200).send("Post deleted successfully");
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};
