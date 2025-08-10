import { useAuth, useUser } from "@clerk/clerk-react";
import IKImage from "../imagekit/IKImage";
import { format } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({ postId, comment }) => {
  // console.log("Comment data:", comment);
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role || "user";
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      console.log("Comment deleted successfully");
      // Invalidate the comments query to refetch the latest comments
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error(error.response?.data || "Failed to delete comment");
    },
  });

  const handleDeleteComment = () => {
    // check if the user is authenticated
    if (!user) {
      toast.error("You need to be logged in to delete comments");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="p-4 bg-slate-100 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        {comment.user.img && (
          <IKImage
            src={comment.user.img}
            alt="user"
            className="rounded-full object-cover w-10 h-10"
            width="40"
            height="40"
          />
        )}
        <span className="font-medium">{comment.user.username}</span>
        <span className="text-gray-500 text-sm">
          {format(comment.createdAt)}
        </span>
        {user &&
          (comment.user.username === user.username || role === "admin") && (
            <span
              className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
              onClick={handleDeleteComment}
            >
              delete
              {mutation.isPending && (
                <span className="ml-2 text-red-500">Deleting...</span>
              )}
            </span>
          )}
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;
