import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SyncLoader from "react-spinners/SyncLoader";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";

const FollowersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const follow = queryParams.get("follow");

  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/user/getFollowersFollowing`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setFollowers(
            follow === "Followings" ? data.following : data.followers
          );
        } else {
          toast.error(data.message || "Failed to fetch followers");
        }
      } catch (error) {
        toast.error("An error occurred while fetching followers." + error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFollowers();
    }
  }, [API_BASE_URL, follow, id]);

  return (
    <div className="bg-yellow-50 min-h-screen">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      <UserNavbar />
      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />
        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{follow}</h1>
            {followers.length > 0 ? (
              <div className="flex flex-col gap-2">
                {followers.map((follower) => (
                  <div
                    key={follower._id}
                    className="gap-2 justify-between bg-white p-4 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center"
                  >
                    <div className="flex gap-3">
                      <img
                        src={follower.avatar || "/default-avatar.png"}
                        alt={follower.name}
                        className="w-14 h-14 rounded-full border-2 border-black mb-3"
                      />
                      <div>
                        <h2 className="text-lg font-bold">{follower.name}</h2>
                        <p className="text-gray-600">@{follower.username}</p>
                      </div>
                    </div>
                    <button 
                    onClick={()=>navigate(`/user/user_profile/${follower._id}`)}
                    className="text-xs whitespace-nowrap sm:text-base bg-blue-300 text-black font-bold py-1 px-4 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center mt-10">
                No followers to display.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowersList;
