import IKImage from "../imagekit/IKImage";

const Comment = () => {
  return (
    <div className="p-4 bg-slate-100 rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <IKImage
          src="/userImg.jpeg"
          alt="user"
          className="rounded-full object-cover w-10 h-10"
          width="40"
          height="40"
        />
        <span className="font-medium">John Doe</span>
        <span className="text-gray-500 text-sm">2 days ago</span>
      </div>
      <div className="mt-4">
        <p className="text-gray-500 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quisquam, quos.
        </p>
      </div>
    </div>
  );
};

export default Comment;
