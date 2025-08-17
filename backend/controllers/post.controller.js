import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { sanitizeHTML } from "../lib/sanitize.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2; // Number of posts per page

  const query = {};

  console.log("req.query:", req.query);

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;
  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    // search title with regex and case insensitive
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    query.user = user._id;
  }

  let sortObj = { createdAt: -1 }; // Default sort by createdAt descending
  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        }; // Last 7 days
        break;
      default:
        sortObj = { createdAt: -1 }; // Default case
        break;
    }
  }
  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username") // Populate user details
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  // get total count of posts
  const totalPosts = await Post.countDocuments();

  console.log("Total posts:", totalPosts);

  const hasMore = totalPosts > page * limit;
  res.status(200).send({ posts, hasMore });
};

export const getPostBySlug = async (req, res) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug }).populate("user", "username img");
  res.status(200).json(post);
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

  // log body
  console.log(req.body);
  let imageFileName = req.body.img || "";
  if (imageFileName.startsWith("/")) {
    imageFileName = imageFileName.slice(1);
  }
  let imagekitFileId = req.body.imagekitFileId || "";

  // search fileId in imagekit by fileName
  if (imageFileName) {
    try {
      const fileDetails = await imagekit.listFiles({
        searchQuery: `name:${imageFileName} AND tags IN ["temp"]`,
        limit: 1,
      });
      if (!fileDetails) {
        console.log("File not found in ImageKit:", imageFileName);
      }
      console.log("Image file details:", fileDetails);
      imagekitFileId = fileDetails.fileId;
    } catch (error) {
      console.error("Error fetching image details:", error);
    }
  }

  // remove temp tags in imagekit library for uploaded images
  if (imagekitFileId) {
    try {
      await imagekit.bulkRemoveTags([imagekitFileId], ["temp"]);
    } catch (error) {
      console.error("Error removing temp tags:", error);
    }
  }

  // use sanitize to prevent XSS attacks
  const safeContent = sanitizeHTML(req.body.content);

  // Generate a slug from the title
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });
  let counter = 2;
  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  // console.log("request body:", req.body);

  const newPost = new Post({
    ...req.body,
    slug,
    user: user._id,
    content: safeContent,
  });

  // console.log("New post created:", newPost);

  const post = await newPost.save();
  res.status(201).send(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  // console.log(clerkUserId);
  // console.log(req.auth());
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in deletePost" });
  }

  const role = req.auth().sessionClaims?.metadata?.role || "user";
  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).send("Post deleted successfully");
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

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth().userId;
  const postId = req.body.postId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized in featurePost" });
  }

  const role = req.auth().sessionClaims?.metadata?.role || "user";
  if (role !== "admin") {
    return res.status(403).json({ message: "Forbidden in featurePost" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const isFeatured = post.isFeatured;
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { isFeatured: !isFeatured },
    { new: true } // Return the updated document
  );
  // await post.save();

  res
    .status(200)
    .json({ message: "Post featured status updated", post: updatedPost });
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
