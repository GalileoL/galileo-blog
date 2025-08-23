import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-500">
        Oops! The page you are looking for does not exist.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
