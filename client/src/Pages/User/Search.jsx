import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";

const Search = () => {
  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar />
      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <main className="flex-grow p-4 md:p-6 bg-yellow-50">
          <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Search Posts
            </h2>
            <form className="flex items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search for projects, authors, or tags..."
                className="flex-grow border-2 border-black p-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600 active:translate-x-1"
              >
                Search
              </button>
            </form>
            {/* Filter Options */}
            <div className="flex gap-4 flex-wrap">
              <button className="px-4 py-2 bg-blue-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                #React
              </button>
              <button className="px-4 py-2 bg-blue-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                #JavaScript
              </button>
              <button className="px-4 py-2 bg-blue-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                #WebDev
              </button>
              {/* Add more tags or categories dynamically */}
            </div>
          </section>

          {/* Search Results Section */}
          <section className="mt-6">
            <h2 className="text-xl md:text-2xl font-black mb-4">Results</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Replace this with dynamic search results */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
                <h3 className="font-bold text-lg mb-2">Example Post Title</h3>
                <p className="text-gray-600">
                  Example description of the post...
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Search;
