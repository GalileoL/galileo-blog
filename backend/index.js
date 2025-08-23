import "dotenv/config";
import express from "express";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import webhookRoute from "./routes/webhook.route.js";
import uploadRoute from "./routes/upload.route.js";
import path from "node:path";
import { sweepTmp, scheduleSweep } from "./lib/cleanup.js";
import connectDB from "./lib/connectDB.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();

app.use(cors(process.env.CLIENT_URL));
app.use(clerkMiddleware());

app.use("/api/webhooks", webhookRoute);

// sync indexes for User, Post, and Comment models
// if (process.env.NODE_ENV !== "production") {
//   try {
//     // for user
//     console.log("[idx] syncing User indexes...");
//     const before = await User.collection.getIndexes().catch(() => ({}));
//     console.log("[idx] before:", Object.keys(before));
//     await User.syncIndexes(); // 关键：会删除 schema 中不存在的索引（如 clerkId_1）
//     const after = await User.collection.getIndexes();
//     console.log("[idx] after:", Object.keys(after));

//     // for post
//     console.log("[idx] syncing Post indexes...");
//     const beforePost = await Post.collection.getIndexes().catch(() => ({}));
//     console.log("[idx] beforePost:", Object.keys(beforePost));
//     await Post.syncIndexes();
//     const afterPost = await Post.collection.getIndexes();
//     console.log("[idx] afterPost:", Object.keys(afterPost));

//     // for comment
//     console.log("[idx] syncing Comment indexes...");
//     const beforeComment = await Comment.collection
//       .getIndexes()
//       .catch(() => ({}));
//     console.log("[idx] beforeComment:", Object.keys(beforeComment));
//     await Comment.syncIndexes();
//     const afterComment = await Comment.collection.getIndexes();
//     console.log("[idx] afterComment:", Object.keys(afterComment));
//   } catch (e) {
//     console.error("[idx] syncIndexes error:", e);
//   }
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/files", express.static(path.join(process.cwd(), "storage", "files")));

// allow cross-origin requests
// make it strict, only allow requests from the client URL
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

console.log("Hello World");
// console.log(process.env.test);

app.listen(3000, () => {
  connectDB();

  scheduleSweep();
  sweepTmp();
  console.log("Server is running on port 3000 ");
});

// app.get("/auth-state", (req, res) => {
//   res.json({
//     authState: req.auth(),
//   });
// });
app.get("/protect", (req, res) => {
  const { userId } = req.auth();
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    message: "Protected route",
    userId,
  });
});

app.use((req, res, next) => {
  console.log("[HIT]", req.method, req.originalUrl);
  next();
});

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/upload", uploadRoute);

// error handling
app.use((err, req, res, next) => {
  console.log("Error occurred:", err);

  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
    stack: err.stack,
    status: err.status || 500,
  });
});
