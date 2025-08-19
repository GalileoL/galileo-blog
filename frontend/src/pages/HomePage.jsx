import { Link } from "react-router-dom";
import { FeaturePosts, MainCategories, PostList } from "../components";

const Homepage = () => {
  console.log("it comes to Homepage");

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* breadcrumb */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>/</span>
        <span className="text-gray-500">Blogs and Articles</span>
      </div>
      {/* introduction */}
      <div className="flex items-center justify-between">
        {/* titles */}
        <div>
          <h1 className="text-grey-800 text-2xl md:text-5xl lg:text-6xl font-bond">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </h1>
          <p className="mt-8 text-md md:text-xl text-gray-500">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus
            consequuntur nam laudantium quia magnam
          </p>
        </div>
        {/* animated button */}
        <Link to="/write" className="relative hidden md:block">
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            className=" text-lg tracking-widest animate-spin animationButton"
            // className="text-lg tracking-widest"
          >
            <path
              id="circlepPath"
              //   d parameters: M = move to, a = arc, 1 = large arc, 0 = small arc,
              //   1 = clockwise, 0 = counterclockwise, z = close path
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 149.9,0 a 75,75 0 1,1 -149.9,0"
              fill="none"
            ></path>
            <text className="text-red-500 text-2xl" fill="">
              <textPath href="#circlepPath" startOffset="0%">
                write a post
              </textPath>
              <textPath href="#circlepPath" startOffset="50%">
                share your ideas
              </textPath>
            </text>
          </svg>
          <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="50"
              height="50"
              fill="none"
              className="size-6"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="6" y1="18" x2="18 " y2="6"></line>
              <polyline points="9 6 18 6 18 15"></polyline>
            </svg>
          </button>
        </Link>
      </div>

      {/* catagories */}
      <MainCategories />
      {/* featured posts */}
      <FeaturePosts />
      {/* post list */}
      <div>
        <h1 className="my-8 text-2xl text-gray-600">recent posts</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
