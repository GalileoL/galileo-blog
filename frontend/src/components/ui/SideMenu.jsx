import { Link, useSearchParams } from "react-router-dom";
import Search from "./Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        sort: e.target.value,
      });
    }
  };
  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        cat: category,
      });
    }
  };

  return (
    <div className="h-max sticky top-8 p-4">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Newest</span>
        </label>
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Most Popular</span>
        </label>
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Trending</span>
        </label>
        <label htmlFor="" className="flex item-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 rounded-sm checked:bg-blue-800 cursor-pointer bg-white"
          />
          <span>Oldest</span>
        </label>
      </div>
      <h1 className="mb-4 text-sm font-medium">Category</h1>

      <div className="flex flex-col gap-2 text-sm">
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("general")}
        >
          All
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("web-design")}
        >
          Web Design
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("development")}
        >
          Development
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("databases")}
        >
          Databases
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("seo")}
        >
          Search Engines
        </span>
        <span
          className="underline cursor-pointer"
          onClick={() => handleCategoryChange("marketing")}
        >
          Marketing
        </span>
      </div>
    </div>
  );
};

export default SideMenu;
