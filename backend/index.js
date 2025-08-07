import express from "express";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import webhookRoute from "./routes/webhook.route.js";
import connectDB from "./lib/connectDB.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();

app.use(cors(process.env.CLIENT_URL));
app.use(clerkMiddleware());

app.use("/api/webhooks", webhookRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow cross-origin requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

console.log("Hello World");
// console.log(process.env.test);

app.listen(3000, () => {
  connectDB();
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

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
    stack: err.stack,
    status: err.status || 500,
  });
});
