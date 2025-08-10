import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const fetchCommentsByPostId = async (postId) => {
  // console.log("Fetching comments for postId:", postId);
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${postId}`
  );
  // console.log("Fetched comments:", response.data);

  return response.data;
};

const Comments = ({ postId }) => {
  const { user } = useUser();
  // console.log("User data:", user);

  const { getToken } = useAuth();
  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsByPostId(postId),
  });

  // console.log("Comments data:", data);

  // data.forEach((element) => {
  //   console.log("Comment user:", element.user);
  // });

  const queryClient = useQueryClient();

  // create a comment
  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${postId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      console.log("Comment created successfully:", res.data);
      // Invalidate the comments query to refetch the latest comments
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      // Handle error, e.g., show a toast notification
      toast.error(error.response?.data || "Failed to create comment");
    },
  });

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc"),
    };
    mutation.mutate(data);
  };

  // if (isPending) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // if (!data || data.length === 0) return <div>No comments yet.</div>;

  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl underline text-gray-500">Comments</h1>
      <form
        className="flex items-center justify-between w-full gap-8 mb-8"
        onSubmit={handleCommentSubmit}
      >
        <textarea
          name="desc"
          placeholder="Write a comment..."
          className="w-full  rounded-xl p-4"
          style={{
            border: "1px solid black",
          }}
        ></textarea>
        <button className="px-4 bg-blue-800 text-white rounded-xl font-medium">
          Send
        </button>
      </form>
      {isPending ? (
        <div>Loading comments...</div>
      ) : error ? (
        <div>Error loading comments</div>
      ) : (
        <>
          {/* Optimistic UI update for new comment */}
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables?.desc} (sending...)`,
                createAt: new Date(),
                user: {
                  img: user?.imageUrl || "",
                  username: user.username || "Anonymous",
                },
              }}
            />
          )}
          {data.map((comment) => (
            <Comment key={comment._id} postId={postId} comment={comment} />
          ))}
        </>
      )}
      {/* {console.log("Rendering comments:", data)}
      {console.log(
        "data after mapping:",
        data?.map((c) => c)
      )} */}
    </div>
  );
};

export default Comments;
