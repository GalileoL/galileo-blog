import { Link } from "react-router-dom";
import IKImage from "../imagekit/IKImage";

const PostListItem = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* image */}
      <div className="md:hidden xl:block xl:w-1/3 ">
        <IKImage
          src="/postImg.jpeg"
          alt="post"
          className="rounded-2xl object-cover"
          width="735"
          //   to best optimize the image, we set max width of the image to 735px (767px - 1rem*2) which is the biggest width of the container
        />
      </div>
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to="/posts/test" className="text-4xl font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
          recusandae
        </Link>
        <div className="flex items-center gap-2 text-gray-500 text-sm ">
          <span>written by</span>
          <Link className="text-blue-800">John Doe</Link>
          <span>on</span>
          <Link className="text-blue-800">Web Design</Link>
          <span>2 days ago</span>
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, odio
          aspernatur placeat libero pariatur ipsum earum, quisquam eligendi quo
          odit suscipit saepe veniam a? Quidem cum sed molestiae labore neque!
        </p>
        <Link to="/posts/test" className="text-blue-800 underline text-sm">
          Read more
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
