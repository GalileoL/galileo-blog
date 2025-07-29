import Comment from "./Comment";

const Comments = () => {
  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl underline text-gray-500">Comments</h1>
      <div className="flex items-center justify-between w-full gap-8">
        <textarea
          name=""
          id=""
          placeholder="Write a comment..."
          className="w-full  rounded-xl p-4"
          style={{
            border: "1px solid black",
          }}
        ></textarea>
        <button className="px-4 bg-blue-800 text-white rounded-xl font-medium">
          Send
        </button>
      </div>
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </div>
  );
};

export default Comments;
