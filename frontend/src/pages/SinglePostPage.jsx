import { Link, useParams } from "react-router-dom";
import IKImage from "../components/imagekit/IKImage";
import { Comments, PostMenuActions, Search } from "../components";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const getPostBySlug = async (slug) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts/${slug}`
  );

  return response.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message ?? "Unknown error"}</div>;
  if (!data) return <div>No post found</div>;

  return (
    <div className="flex flex-col gap-8">
      {/* details */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>written by</span>
            <Link className="text-blue-800">John Doe</Link>
            <span>on</span>
            <Link className="text-blue-800">Web Design</Link>
            <span>2 days ago</span>
          </div>
          <p className="text-gray-500 font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </div>
        <div className="hidden lg:block w-2/5">
          <IKImage
            src="/postImg.jpeg"
            alt="post"
            className="rounded-2xl object-cover"
            width="735"
            height="412"
          />
        </div>
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* text */}
        <div className="lg:text-lg flex flex-col gap-4">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores
            repellat, aspernatur inventore similique facilis praesentium, odio
            distinctio error harum, ipsum nemo reiciendis quisquam voluptate
            officia porro laboriosam quam hic odit provident esse magnam. Nemo
            minus nihil dolor a sunt eveniet? Reiciendis voluptates alias unde
            quaerat, consectetur excepturi fugit labore eligendi?
          </p>
          <p>
            Reiciendis dicta, labore nesciunt iure vitae tempora dolor quas
            impedit nihil odio id officia hic voluptates eaque qui animi,
            repudiandae numquam corrupti, ducimus accusamus possimus accusantium
            natus. Excepturi cumque, voluptas quibusdam autem dignissimos magnam
            natus, molestiae in esse obcaecati eveniet aspernatur. Modi
            assumenda possimus quo provident, quae sit explicabo eaque!
          </p>
          <p>
            Amet tempore ducimus sit aut in. Assumenda nulla nesciunt
            consequuntur ea excepturi, dolorem ab ut nostrum cumque natus sit
            qui repudiandae debitis iure, omnis, officiis eos fugit veritatis
            iusto dignissimos quisquam! Dolor esse commodi, sequi quaerat
            laboriosam accusantium nobis quibusdam iusto magni accusamus
            repellat aliquid consequatur dolorum excepturi. Perferendis, non.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores
            repellat, aspernatur inventore similique facilis praesentium, odio
            distinctio error harum, ipsum nemo reiciendis quisquam voluptate
            officia porro laboriosam quam hic odit provident esse magnam. Nemo
            minus nihil dolor a sunt eveniet? Reiciendis voluptates alias unde
            quaerat, consectetur excepturi fugit labore eligendi?
          </p>
          <p>
            Reiciendis dicta, labore nesciunt iure vitae tempora dolor quas
            impedit nihil odio id officia hic voluptates eaque qui animi,
            repudiandae numquam corrupti, ducimus accusamus possimus accusantium
            natus. Excepturi cumque, voluptas quibusdam autem dignissimos magnam
            natus, molestiae in esse obcaecati eveniet aspernatur. Modi
            assumenda possimus quo provident, quae sit explicabo eaque!
          </p>
          <p>
            Amet tempore ducimus sit aut in. Assumenda nulla nesciunt
            consequuntur ea excepturi, dolorem ab ut nostrum cumque natus sit
            qui repudiandae debitis iure, omnis, officiis eos fugit veritatis
            iusto dignissimos quisquam! Dolor esse commodi, sequi quaerat
            laboriosam accusantium nobis quibusdam iusto magni accusamus
            repellat aliquid consequatur dolorum excepturi. Perferendis, non.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores
            repellat, aspernatur inventore similique facilis praesentium, odio
            distinctio error harum, ipsum nemo reiciendis quisquam voluptate
            officia porro laboriosam quam hic odit provident esse magnam. Nemo
            minus nihil dolor a sunt eveniet? Reiciendis voluptates alias unde
            quaerat, consectetur excepturi fugit labore eligendi?
          </p>
          <p>
            Reiciendis dicta, labore nesciunt iure vitae tempora dolor quas
            impedit nihil odio id officia hic voluptates eaque qui animi,
            repudiandae numquam corrupti, ducimus accusamus possimus accusantium
            natus. Excepturi cumque, voluptas quibusdam autem dignissimos magnam
            natus, molestiae in esse obcaecati eveniet aspernatur. Modi
            assumenda possimus quo provident, quae sit explicabo eaque!
          </p>
          <p>
            Amet tempore ducimus sit aut in. Assumenda nulla nesciunt
            consequuntur ea excepturi, dolorem ab ut nostrum cumque natus sit
            qui repudiandae debitis iure, omnis, officiis eos fugit veritatis
            iusto dignissimos quisquam! Dolor esse commodi, sequi quaerat
            laboriosam accusantium nobis quibusdam iusto magni accusamus
            repellat aliquid consequatur dolorum excepturi. Perferendis, non.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores
            repellat, aspernatur inventore similique facilis praesentium, odio
            distinctio error harum, ipsum nemo reiciendis quisquam voluptate
            officia porro laboriosam quam hic odit provident esse magnam. Nemo
            minus nihil dolor a sunt eveniet? Reiciendis voluptates alias unde
            quaerat, consectetur excepturi fugit labore eligendi?
          </p>
          <p>
            Reiciendis dicta, labore nesciunt iure vitae tempora dolor quas
            impedit nihil odio id officia hic voluptates eaque qui animi,
            repudiandae numquam corrupti, ducimus accusamus possimus accusantium
            natus. Excepturi cumque, voluptas quibusdam autem dignissimos magnam
            natus, molestiae in esse obcaecati eveniet aspernatur. Modi
            assumenda possimus quo provident, quae sit explicabo eaque!
          </p>
          <p>
            Amet tempore ducimus sit aut in. Assumenda nulla nesciunt
            consequuntur ea excepturi, dolorem ab ut nostrum cumque natus sit
            qui repudiandae debitis iure, omnis, officiis eos fugit veritatis
            iusto dignissimos quisquam! Dolor esse commodi, sequi quaerat
            laboriosam accusantium nobis quibusdam iusto magni accusamus
            repellat aliquid consequatur dolorum excepturi. Perferendis, non.
          </p>
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8 flex flex-col gap-4">
          <h1 className=" mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            {/* image and name */}
            <div className="flex  gap-8 items-center">
              <IKImage
                src="/userImg.jpeg"
                alt="author"
                className="rounded-full object-cover"
                width="50"
                height="50"
              />
              <Link className="text-lg text-blue-800">John Doe</Link>
            </div>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
            <div className="flex gap-2">
              <Link>
                <IKImage
                  src="/facebook.svg"
                  alt="facebook"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                />
              </Link>
              <Link>
                <IKImage
                  src="/instagram.svg"
                  alt="instagram"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                />
              </Link>
            </div>
          </div>
          <PostMenuActions />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/test">
              All
            </Link>
            <Link className="underline" to="/test">
              Web Design
            </Link>
            <Link className="underline" to="/test">
              Development
            </Link>
            <Link className="underline" to="/test">
              Databases
            </Link>
            <Link className="underline" to="/test">
              Search Engines
            </Link>
            <Link className="underline" to="/test">
              Marketing
            </Link>
            <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
            <Search />
          </div>
        </div>
      </div>
      <Comments />
    </div>
  );
};

export default SinglePostPage;
