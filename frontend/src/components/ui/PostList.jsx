import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import PostListItem from "./PostListItem";
import PostListSkeleton from "../skeletons/PostListSkeleton";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { PostsAPI } from "../../api/req_modules/posts.js";
const fetchPosts = async (pageParam, searchParams) => {
  const searchParamsObj = Object.fromEntries([...searchParams]);

  console.log("Search params:", searchParamsObj);

  console.log("Fetching posts with pageParam:", pageParam);

  // const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
  //   params: {
  //     page: pageParam,
  //     limit: 10, // Number of posts per page
  //     ...searchParamsObj, // Include search params if any
  //   },
  // });
  const posts = await PostsAPI.getPosts({
    page: pageParam,
    limit: 10,
    ...searchParamsObj,
  });

  return posts.data;
};

const PostList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts", searchParams.toString()],
    queryFn: ({ pageParam }) => fetchPosts(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  if (status === "pending")
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <PostListSkeleton key={index} />
        ))}
      </div>
    );

  if (error) return <div>Error: {error.message ?? "Unknown error"}</div>;

  // all posts
  const allPosts = data?.pages?.flatMap((page) => page.posts) ?? [];
  // console.log("infinite query data:", data);

  // return <div>{data.name}</div>
  return (
    <div className="flex flex-col gap-12 mb-8">
      <InfiniteScroll
        dataLength={allPosts.length} //This is important field to render the next data
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {allPosts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
