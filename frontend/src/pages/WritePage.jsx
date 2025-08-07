import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const WritePage = () => {
  const { isLoaded, isSignedIn } = useUser();

  const { getToken } = useAuth();
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      console.log("success!", res.data);
    },
  });
  console.log(mutation);

  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded && !isSignedIn)
    return <div>You must be signed in to write a post</div>;

  return (
    <div className="flex flex-col gap-6 md:h-[calc(100vh-80px)]">
      <h1 className="text-cl font-light">Create a new post</h1>
      <form action="" className="flex flex-col gap-6 flex-1 mb-6">
        <button className=" bg-white w-max p-2 shadow-md rounded-xl text-sm text-gray-500">
          Add a cover image
        </button>
        <input
          type="text"
          placeholder="My Awesome Story"
          className=" p-2 text-4xl font-semibold bg-transparent outline-none"
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm ">
            Choose a catrgory:
          </label>
          <select
            name="cat"
            id=""
            className="rounded-xl bg-white shadow-md  p-2"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        <textarea
          name="desc"
          id=""
          placeholder="A short description of your post"
          className="bg-white shadow-md rounded-xl p-4"
        ></textarea>
        <ReactQuill
          theme="snow"
          className="bg-white shadow-md rounded-xl p-2 flex-1"
        />
        <button className="bg-blue-500 text-white  rounded-xl font-medium mt-4 p-2 w-36">
          Send
        </button>
      </form>
    </div>
  );
};

export default WritePage;
