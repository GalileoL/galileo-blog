import { Link } from "react-router-dom";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-between gap-8">
      {/* links */}
      <div className=" flex items-center justify-center flex-wrap">
        <Link
          to="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2 "
        >
          All posts
        </Link>
        <Link
          to="/posts"
          className="hover:text-blue-800 rounded-full px-4 py-2"
        >
          Web Design
        </Link>
        <Link
          to="/posts"
          className="hover:text-blue-800 rounded-full px-4 py-2"
        >
          Development
        </Link>
        <Link
          to="/posts"
          className="hover:text-blue-800 rounded-full px-4 py-2"
        >
          Database
        </Link>
        <Link
          to="/posts"
          className="hover:text-blue-800 rounded-full px-4 py-2"
        >
          Search Engines
        </Link>
        <Link
          to="/posts"
          className="hover:text-blue-800 rounded-full px-4 py-2"
        >
          Marking
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <div className="flex bg-gray-100 p-2 rounded-full items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="gray"
        >
          <circle cx="10.5" cy="10.5" r="7.5"></circle>
          <line x1="16.5" y1="16.5 " x2="22" y2="22"></line>
        </svg>
        <input
          type="text"
          placeholder="search a post..."
          className="bg-transparent "
        />
      </div>
    </div>
  );
};

export default MainCategories;
