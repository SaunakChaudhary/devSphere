import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../../Context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";

const UserDashboard = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserDataContext);
  const queryParams = new URLSearchParams(location.search);
  const newUser = queryParams.get("newUser");

  const [posts] = useState([
    {
      id: 1,
      title: "Building a Modern React Application",
      author: "Sarah Chen",
      description:
        "A comprehensive guide to building scalable React applications with modern tools and best practices.",
      likes: 234,
      comments: 45,
      tags: ["react", "javascript", "webdev"],
      authorImage: "https://placehold.co/400",
    },
    {
      id: 2,
      title: "Mastering CSS Grid Layout",
      author: "Alex Rodriguez",
      description:
        "Deep dive into CSS Grid with practical examples and responsive design patterns.",
      likes: 189,
      comments: 32,
      tags: ["css", "frontend", "responsive"],
      authorImage: "https://placehold.co/400",
    },
    {
      id: 3,
      title: "Node.js Authentication Best Practices",
      author: "Michael Park",
      description:
        "Secure authentication implementations in Node.js applications with JWT and OAuth.",
      likes: 156,
      comments: 28,
      tags: ["nodejs", "security", "backend"],
      authorImage: "https://placehold.co/400",
    },
  ]);

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="home" />

      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <main className="flex-grow p-4 md:p-6">
          {newUser && (
            <section className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-6 mb-6 relative">
              <button
                onClick={() => navigate("/dashboard")}
                className="absolute top-2 right-2 bg-red-500 flex justify-center items-center w-5 h-5 shadow-[2px_2px_0px_0px] active:translate-x-1 font-bold"
              >
                <i className="ri-close-large-fill"></i>
              </button>
              <h2 className="text-2xl md:text-3xl font-black text-black mb-4">
                Welcome to Your Dashboard, {user.name}!
              </h2>
              <p className="text-black">
                Manage your profile, projects, challenges, and more in one
                place.
              </p>
            </section>
          )}

          {/* Featured Posts Section */}
          <section className="mb-20 sm:mb-6">
            <h2 className="text-xl md:text-2xl font-black mb-4">
              Featured Posts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.authorImage}
                      alt={post.author}
                      className="w-8 h-8 md:w-10 md:h-10 border-2 border-black"
                    />
                    <div>
                      <h3 className="font-bold">{post.author}</h3>
                      <h5 className="text-gray-500 text-xs">@{post.author}</h5>
                    </div>
                  </div>

                  <h4 className="text-lg md:text-xl font-black mb-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 border-2 border-black"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <i className="ri-heart-line"></i>
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-chat-1-line"></i>
                      {post.comments}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
