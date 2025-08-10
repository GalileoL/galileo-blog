import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      if (location.pathname === "/posts") {
        setSearchParams({ ...Object.fromEntries(searchParams), search: query });
      } else {
        navigate(`/posts?search=${query}`);
      }
    }
  };
  return (
    <div className="bg-gray-100 rounded-full p-2 flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="gray"
      >
        <circle cx="10.5" cy="10.5" r="7.5"></circle>
        <line x1="16.5" y1="16.5" x2="22" y2="22"></line>
      </svg>
      <input
        type="text"
        placeholder="Search a post ..."
        className="bg-transparent outline-none"
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Search;
