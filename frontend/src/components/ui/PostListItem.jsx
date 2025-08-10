import { Link } from "react-router-dom";
import IKImage from "../imagekit/IKImage";
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-8">
      {/* image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3 ">
          <IKImage
            src={post.img}
            alt="post"
            className="rounded-2xl object-cover"
            width="735"
            //   to best optimize the image, we set max width of the image to 735px (767px - 1rem*2) which is the biggest width of the container
          />
        </div>
      )}
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/posts/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-500 text-sm ">
          <span>written by</span>
          <Link
            className="text-blue-800"
            to={`/posts?author=${post.user.username}`}
          >
            {post.user.username}
          </Link>
          <span>on</span>
          <Link className="text-blue-800" to={`/posts?cat=${post.category}`}>
            {post.category}
          </Link>
          <span> {format(post.createdAt)} </span>
        </div>
        <p>{post.desc}</p>
        <Link to="/posts/test" className="text-blue-800 underline text-sm">
          Read more
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
