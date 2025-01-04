import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../../Context/UserContext";
import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RecentChats = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  const handleChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/message/SearchUserExceptLoggedInUser/${searchQuery}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ loggedInUser: user?._id }),
          }
        );
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data);
        } else {
          toast.error(data.message || "Something went wrong.");
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 500); // Debounce 500ms delay

    return () => clearTimeout(timeoutId); // Cleanup timeout on every search query change
  }, [API_BASE_URL, searchQuery, user?._id]);

  const handleCreateCommunity = () => {
    alert("Community creation feature coming soon!");
  };

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="chat" />

      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>

        <main className="flex-grow p-4 md:p-6 mb-20">
          <section className="bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 rounded-lg  border-black p-6 mb-6">
            <h2 className="text-2xl md:text-3xl font-black mb-4">Search</h2>

            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search users, companies, or communities..."
                className="flex-grow p-2 border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </section>
          {searchResults.length === 0 && recentChats.length === 0 && (
            <p className="text-center font-bold text-2xl text-gray-500">No results found.</p>
          )}
          {(recentChats.length > 0 || searchResults.length > 0) && (
            <section className="bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 rounded-lg  border-black p-6 mb-6">
              {recentChats.length > 0 && (
                <h2 className="text-2xl md:text-3xl font-black mb-4">
                  Recent Chats
                </h2>
              )}

              {searchResults.length === 0 && recentChats.length === 0 ? (
                <p>No results found.</p>
              ) : (
                <section>
                  {searchResults.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {searchResults.map((chat) => (
                        <article
                          onClick={() => navigate(`/user/userChat/${chat._id}`)}
                          key={chat._id}
                          className="bg-white border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center gap-4"
                        >
                          <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="w-12 h-12 md:w-16 md:h-16 border-2 rounded-lg  border-black rounded-full"
                          />
                          <div>
                            <h3 className="text-lg md:text-xl font-black mb-1">
                              {chat.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-1 line-clamp-1">
                              {chat.lastMessage || "Hiii"}
                            </p>
                            <span className="text-gray-500 text-xs">
                              {chat.time || "10:30 pm"}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </section>
          )}
        </main>
      </div>

      <button
        onClick={handleCreateCommunity}
        className="fixed bottom-24 right-4 sm:bottom-4 bg-purple-500 text-white font-bold p-4 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
      >
        <i className="ri-add-line sm:text-2xl"></i>
      </button>
    </div>
  );
};

export default RecentChats;
