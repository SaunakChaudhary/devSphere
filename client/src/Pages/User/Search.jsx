import { useState } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailedProject from "../../Components/DetailedProject";
import toast from "react-hot-toast";
import { UserDataContext } from "../../Context/UserContext";
import { useContext } from "react";

const Search = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user } = useContext(UserDataContext);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchDataa, setSearchDataa] = useState([]);
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [checkLiked, setCheckLiked] = useState(false);

  // Search For a Result
  useEffect(() => {
    const searchData = async () => {
      const response = await fetch(
        `${API_BASE_URL}/search/getSearchResults?search=${searchQuery}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSearchDataa(data.users);
        setSearchResults(data.projects);
        setCheckLiked(false);
      } else {
        console.log(data.message);
      }
    };
    if (searchQuery) {
      searchData();
    } else {
      setSearchDataa([]);
    }
  }, [API_BASE_URL, searchQuery, checkLiked]);

  const [popularTags, setPopularTags] = useState([]);
  const [dispProject, setDispProject] = useState([]);

  const handleDispProject = (index) => {
    setDispProject((prevDispProject) => {
      const newDispProject = [...prevDispProject];
      newDispProject[index] = !newDispProject[index];
      return newDispProject;
    });
  };

  const handleLike = async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/project/likeUnlikePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, userId: user._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setCheckLiked(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const popularTagsFunc = async () => {
      const response = await fetch(`${API_BASE_URL}/hashtag/get-hashtags`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        const popularTags = data
          .filter((tag) => tag.count >= 1)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setPopularTags(popularTags);
      } else {
        console.log(data.message);
      }
    };
    popularTagsFunc();
  }, [API_BASE_URL]);

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="Search" />
      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <main className="flex-grow p-4 md:p-6">
          {/* Search Section */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-">
            <h2 className="text-2xl md:text-3xl font-black mb-4">Search</h2>

            {/* Search Input */}
            <form className="relative mb-6">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for projects, authors, or tags..."
                className="w-full border-2 border-black p-4 pl-12 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-blue-400 "
              />
            </form>

            {/* Popular Tags */}
            {searchDataa.length === 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Popular Tags:</h3>
                <div className="flex gap-3 flex-wrap">
                  {popularTags.map((tag) => (
                    <button
                      onClick={() => navigate(`/user/projects/${tag.tag}`)}
                      key={tag._id}
                      className={`px-4 font-bold py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  transition-all bg-blue-100 hover:bg-blue-200`}
                    >
                      #{tag.tag}
                      <span className="ml-2 text-sm">({tag.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="max-h-60 overflow-y-auto">
              {searchDataa.length > 0 ? (
                searchDataa.slice(-10).map((user, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer flex items-center gap-4 my-3 w-full p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  hover:bg-gray-200 transition-all"
                    onClick={() => navigate(`/user/user_profile/${user._id}`)}
                  >
                    <div>
                      <img
                        src={user.avatar}
                        alt="userPhoto"
                        className="w-12 h-12  shadow-md"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">{user.name}</h2>
                      <h3 className="text-gray-500 text-sm">
                        @{user.username}
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No results found.</p>
              )}
            </div>
          </section>

          {/* Results Section */}
          <section className="mt-10 mb-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-black">
                Projects ({searchResults.length})
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((result, index) => (
                <div key={result._id}>
                  <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:-translate-y-1 transition-transform cursor-pointer">
                    <h3 className="font-black text-lg mb-2">{result.title}</h3>
                    <p
                      className="text-gray-600 mb-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          result.description.length > 500
                            ? result.description?.substring(0, 150) + "..."
                            : result.description,
                      }}
                    ></p>
                    <div
                      className="block mb-4 text-blue-500 font-semibold cursor-pointer"
                      onClick={() => handleDispProject(index)}
                    >
                      Read more ...
                    </div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {result.technologies.map((tag) => (
                        <span
                          onClick={() => navigate(`/user/projects/${tag.tag}`)}
                          key={tag._id}
                          className="px-2 py-1 bg-blue-100 border-2 border-black text-sm font-bold"
                        >
                          #{tag.tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span
                        onClick={() =>
                          navigate(`/user/user_profile/${result.userId._id}`)
                        }
                        className="flex items-center gap-1"
                      >
                        <i className="ri-user-line"></i>
                        {result.userId.username}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(result._id)}
                          className="flex items-center gap-1 transition-colors"
                        >
                          <i
                            className={`${
                              result.likes.includes(user._id)
                                ? "ri-heart-fill text-red-500"
                                : "ri-heart-line"
                            }`}
                          />
                          <span className="text-sm">{result.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {dispProject[index] && (
                    <DetailedProject
                      title={result.title}
                      userImage={result.userId.avatar}
                      Name={result.userId.name}
                      username={result.userId.username}
                      setDispProject={setDispProject}
                      description={result.description}
                      githublink={result.githubRepo}
                      demoUrl={result?.demoUrl || ""}
                      projectTechnologies={result.technologies}
                      index={index}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Search;
