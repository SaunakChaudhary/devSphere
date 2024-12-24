import  { useState } from 'react';
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // Sample data
  const popularTags = [
    { id: 1, name: 'React', count: 245 },
    { id: 2, name: 'JavaScript', count: 189 },
    { id: 3, name: 'WebDev', count: 167 },
    { id: 4, name: 'Python', count: 145 },
    { id: 5, name: 'AI', count: 98 },
    { id: 6, name: 'CSS', count: 87 }
  ];

  const searchResults = [
    {
      id: 1,
      title: "Modern React Hooks Tutorial",
      description: "Learn how to use React Hooks effectively in your projects...",
      author: "John Doe",
      tags: ["React", "JavaScript"],
      likes: 234,
      comments: 45
    },
    {
      id: 2,
      title: "Building Responsive Layouts",
      description: "Master CSS Grid and Flexbox for modern responsive designs...",
      author: "Jane Smith",
      tags: ["CSS", "WebDev"],
      likes: 187,
      comments: 32
    },
    {
      id: 3,
      title: "Python Data Science Guide",
      description: "Comprehensive guide to data analysis with Python...",
      author: "Mike Johnson",
      tags: ["Python", "AI"],
      likes: 156,
      comments: 28
    }
  ];

  const toggleFilter = (tag) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(t => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar />
      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <main className="flex-grow p-4 md:p-6">
          {/* Search Section */}
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Search Posts
            </h2>
            <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="relative flex-grow">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for projects, authors, or tags..."
                  className="w-full border-2 border-black p-3 pl-10 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600 active:translate-y-1 transition-all flex items-center gap-2"
              >
                <i className="ri-search-line"></i>
                Search
              </button>
            </form>

            {/* Popular Tags */}
            <div className="mb-6">
              <h3 className="font-bold mb-3">Popular Tags:</h3>
              <div className="flex gap-3 flex-wrap">
                {popularTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleFilter(tag.name)}
                    className={`px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      activeFilters.includes(tag.name)
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    #{tag.name}
                    <span className="ml-2 text-sm">({tag.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-black">
                Results ({searchResults.length})
              </h2>
              <p className="text-gray-600 font-bold">
                Showing {searchResults.length} of {searchResults.length} results
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map(result => (
                <div
                  key={result.id}
                  className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:-translate-y-1 transition-transform cursor-pointer"
                >
                  <h3 className="font-black text-lg mb-2">{result.title}</h3>
                  <p className="text-gray-600 mb-4">{result.description}</p>
                  
                  <div className="flex gap-2 flex-wrap mb-4">
                    {result.tags.map(tag => (
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