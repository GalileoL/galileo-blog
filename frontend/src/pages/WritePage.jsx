import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
// import ReactQuill from "react-quill-new";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IKUpload } from "../components";
import DOMPurify from "dompurify";

const ReactQuill = lazy(() => import("react-quill-new"));

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

    // XSS protection: sanitize the content
    const safeContent = DOMPurify.sanitize(value, {
      USE_PROFILES: { html: true },
    });

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: safeContent,
    };
    console.log("Submitting post data:", data);
    // check title
    if (!data.title) {
      toast.error("Title is required");
      return;
    }
    // check description
    if (!data.desc) {
      toast.error("Description is required");
      return;
    }
    // check content
    if (!data.content) {
      toast.error("Content is required");
      return;
    }

    mutation.mutate(data);
  };

  const editorDisabled = mutation.isPending || (0 < progress && progress < 100);

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
        {/* if select cover image (uploaded cover image), show preview */}
        {cover && (
          <div className="relative w-64 sm:w-72 md:w-80 lg:w-[28rem] aspect-video">
            {/* preview */}
            <img
              src={
                cover.url ||
                `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}/${
                  cover.filePath
                }`
              }
              alt="Cover"
              className="h-full w-full object-cover rounded-2xl shadow-lg ring-1 ring-black/10"
            />

            {/* left up corner remove button */}
            <button
              type="button"
              onClick={() => setCover(null)}
              className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-red-500/90 px-3 py-1.5
                 text-xs font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-white/80 transition"
              aria-label="Remove cover"
            >
              Remove
            </button>
          </div>
        )}

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
          {/* lazy load editor */}
          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill
              theme="snow"
              className="bg-white shadow-md rounded-xl p-2 flex-1"
              value={value}
              onChange={setValue}
              readOnly={editorDisabled}
            />
          </Suspense>
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
