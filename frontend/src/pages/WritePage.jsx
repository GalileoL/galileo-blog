import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IKUpload } from "../components";

const WritePage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);

  // insert image and video to react-quill editor
  useEffect(() => {
    img &&
      setValue((prev) => {
        return prev + `<img src="${img.url}" alt="image" class="w-full" />`;
      });
  }, [img]);
  useEffect(() => {
    video &&
      setValue((prev) => {
        return prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`;
      });
  }, [video]);

  const navigate = useNavigate();

  const { getToken } = useAuth();

  // this is for sending the post data to the backend
  // we use react-query to handle the mutation
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      console.log("success!", res.data);
      toast.success("Post created successfully!");
      navigate(`/posts/${res.data.slug}`);
    },
  });
  // console.log(mutation);

  if (!isLoaded) return <div>Loading...</div>;
  if (isLoaded && !isSignedIn)
    return <div>You must be signed in to write a post</div>;

  const handleSubmit = (e) => {
    // Prevent the default form submission, keep SPA handling
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };
    console.log("Submitting post data:", data);

    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 md:h-[calc(100vh-80px)]">
      <h1 className="text-cl font-light">Create a new post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <IKUpload type="image" setProgress={setProgress} setData={setCover}>
          <button
            type="button"
            className=" bg-white w-max p-2 shadow-md rounded-xl text-sm text-gray-500"
          >
            Add a cover image
          </button>
        </IKUpload>
        <input
          type="text"
          placeholder="My Awesome Story"
          className=" p-2 text-4xl font-semibold bg-transparent outline-none"
          name="title"
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm ">
            Choose a catrgory:
          </label>
          <select
            name="category"
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
        <div className="flex flex-1">
          <div className="flex flex-col gap-2 mr-2">
            <IKUpload type="image" setProgress={setProgress} setData={setImg}>
              <span> 🌉</span>
            </IKUpload>
            <IKUpload type="video" setProgress={setProgress} setData={setVideo}>
              <span> 🎥</span>
            </IKUpload>
          </div>
          <ReactQuill
            theme="snow"
            className="bg-white shadow-md rounded-xl p-2 flex-1"
            value={value}
            onChange={setValue}
            readOnly={mutation.isPending || (0 < progress && progress < 100)}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 disabled:bg-blue-300 disabled:cursor-not-allowed text-white  rounded-xl font-medium mt-4 p-2 w-36 cursor-pointer"
        >
          {mutation.isPending ? "Loading..." : "send"}
        </button>
        {"progress: " + progress + "%"}
        {mutation.isError && (
          <div className="text-red-500">Error: {mutation.error.message}</div>
        )}
      </form>
    </div>
  );
};

export default WritePage;
