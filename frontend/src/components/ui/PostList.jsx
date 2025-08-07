import { useQuery } from "@tanstack/react-query";
import PostListItem from "./PostListItem";
import axios from "axios";

const fetchPosts = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
  return response.data;
};

const PostList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: fetchPosts,
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  // return <div>{data.name}</div>
  return (
    <div className="flex flex-col gap-12 mb-8">
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
      <PostListItem />
    </div>
  );
};

export default PostList;
