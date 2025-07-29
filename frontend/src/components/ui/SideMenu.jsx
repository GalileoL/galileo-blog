import { Link } from "react-router-dom";
import Search from "./Search";

const SideMenu = () => {
  return (
    <div className="h-max sticky top-8 p-4">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            id=""
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Newest</span>
        </label>
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            id=""
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Most Popular</span>
        </label>
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            id=""
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Trending</span>
        </label>
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            id=""
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Oldest</span>
        </label>
      </div>
      <h1 className="mb-4 text-sm font-medium">Category</h1>

      <div className="flex flex-col gap-2 text-sm">
        <Link to="/posts">All</Link>
        <Link to="/posts?cat=web-design">Web Design</Link>
        <Link to="/posts?cat=development">Development</Link>
        <Link to="/posts?cat=databases">Databases</Link>
        <Link to="/posts?cat=seo">Search Engines</Link>
        <Link to="/posts?cat=marketing">Marketing</Link>
      </div>
    </div>
  );
};

export default SideMenu;
