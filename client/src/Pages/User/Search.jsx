import { useState } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchDataa, setSearchDataa] = useState([]);
  const navigate = useNavigate();

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
      } else {
        console.log(data.message);
      }
    };
    if (searchQuery) {
      searchData();
    } else {
      setSearchDataa([]);
    }
  }, [API_BASE_URL, searchQuery]);

  // Sample data
  const popularTags = [
    { id: 1, name: "React", count: 245 },
    { id: 2, name: "JavaScript", count: 189 },
    { id: 3, name: "WebDev", count: 167 },
    { id: 4, name: "Python", count: 145 },
    { id: 5, name: "AI", count: 98 },
    { id: 6, name: "CSS", count: 87 },
  ];

  const searchResults = [
    {
      id: 1,
      title: "Modern React Hooks Tutorial",
      description:
        "Learn how to use React Hooks effectively in your projects...",
      author: "John Doe",
      tags: ["React", "JavaScript"],
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      title: "Building Responsive Layouts",
      description:
        "Master CSS Grid and Flexbox for modern responsive designs...",
      author: "Jane Smith",
      tags: ["CSS", "WebDev"],
      likes: 187,
      comments: 32,
    },
    {
      id: 3,
      title: "Python Data Science Guide",
      description: "Comprehensive guide to data analysis with Python...",
      author: "Mike Johnson",
      tags: ["Python", "AI"],
      likes: 156,
      comments: 28,
    },
  ];

  const toggleFilter = (tag) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter((t) => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

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
            {searchDataa.length === 0 && <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Popular Tags:</h3>
              <div className="flex gap-3 flex-wrap">
                {popularTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleFilter(tag.name)}
                    className={`px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  transition-all ${
                      activeFilters.includes(tag.name)
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 hover:bg-blue-200"
                    }`}
                  >
                    #{tag.name}
                    <span className="ml-2 text-sm">({tag.count})</span>
                  </button>
                ))}
              </div>
            </div>}

            {/* Search Results */}
            <div className="max-h-60 overflow-y-auto">
              {searchDataa.length > 0 ? (
                searchDataa.slice(-10).map((user, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer flex items-center gap-4 my-3 w-full p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  hover:bg-gray-200 transition-all"
                    onClick={()=>navigate(`/user/user_profile/${user._id}`)}
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
          <section className="mt-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-black">
                Results ({searchResults.length})
              </h2>
              <p className="text-gray-600 font-bold">
                Showing {searchResults.length} of {searchResults.length} results
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:-translate-y-1 transition-transform cursor-pointer"
                >
                  <h3 className="font-black text-lg mb-2">{result.title}</h3>
                  <p className="text-gray-600 mb-4">{result.description}</p>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {result.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 border-2 border-black text-sm font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line"></i>
                      {result.author}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <i className="ri-heart-line"></i>
                        {result.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-chat-1-line"></i>
                        {result.comments}
                      </span>
                    </div>
                  </div>
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
