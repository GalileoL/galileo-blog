import IKImage from "../imagekit/IKImage";
import { Link } from "react-router-dom";

const FeaturePosts = () => {
  return (
    <div className="mt-8 flex flex-col gap-8 lg:flex-row">
      {/* first */}
      <div className="flex flex-col  gap-4 w-full lg:w-1/2">
        {/* image */}
        <IKImage
          src="/featured1.jpeg"
          alt="feature post"
          className="rounded-3xl object-cover"
          width="959"
          //   to best optimize the image, we set max width of the image to 959px (1023px - 2rem*2) which is the biggest width of the container
        />

        {/* detials */}
        <div className="flex  gap-4 items-center">
          <h1 className=" font-semibold lg:text-lg">01.</h1>

          <Link to="/" className="text-gray-500 lg:text-lg">
            Web Design
          </Link>
          <span className="text-gray-500">2 days ago</span>
        </div>
        {/* title */}
        <Link
          to="/"
          className=" text-xl lg:text-3xl font-semibold lg:font-bold"
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </Link>
      </div>

      {/* others */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* second */}
        <div className="lg:h-1/3 flex justify-between gap-4 ">
          {/* image */}
          <div className="w-1/3 aspect-video">
            <IKImage
              src="/featured2.jpeg"
              alt="feature post"
              className="rounded-3xl object-cover w-full h-full"
              width="320"
              // height="210"
            />
          </div>
          {/* detials and title*/}
          <div className="w-2/3">
            {/* details */}
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">02.</h1>
              <Link className="text-blue-800">web design</Link>
              <span className="text-gray-500 text-sm">2 days ago</span>
            </div>
            {/* title */}
            <Link
              to="/"
              className=" text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </Link>
          </div>
        </div>
        {/* third */}
        <div className="lg:h-1/3 flex justify-between gap-4 ">
          {/* image */}
          <div className="w-1/3 aspect-video">
            <IKImage
              src="/featured3.jpeg"
              alt="feature post"
              className="rounded-3xl object-cover w-full h-full"
              width="320"
              // height="210"
            />
          </div>
          {/* detials and title*/}
          <div className="w-2/3">
            {/* details */}
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">03.</h1>
              <Link className="text-blue-800">web design</Link>
              <span className="text-gray-500 text-sm">2 days ago</span>
            </div>
            {/* title */}
            <Link
              to="/"
              className=" text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </Link>
          </div>
        </div>
        {/* fourth */}
        <div className="lg:h-1/3 flex justify-between gap-4 ">
          {/* image */}
          <div className="w-1/3 aspect-video">
            <IKImage
              src="/featured4.jpeg"
              alt="feature post"
              className="rounded-3xl object-cover w-full h-full"
              width="320"
              // height="210"
            />
          </div>
          {/* detials and title*/}
          <div className="w-2/3">
            {/* details */}
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <h1 className="font-semibold">04.</h1>
              <Link className="text-blue-800">web design</Link>
              <span className="text-gray-500 text-sm">2 days ago</span>
            </div>
            {/* title */}
            <Link
              to="/"
              className=" text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
            >
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePosts;
