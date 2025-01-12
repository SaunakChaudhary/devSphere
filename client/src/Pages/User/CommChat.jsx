import { useContext, useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import toast from "react-hot-toast";
import { useParams,useNavigate } from "react-router-dom";
import { UserDataContext } from "../../Context/UserContext";
import { SocketContext } from "../../Context/SocketContext";

const CommChat = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserDataContext);
  const { id } = useParams();
  const isLocalhost = window.location.hostname === "localhost";

  const { socket } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [commDetails, setCommDetails] = useState(false);
  const [checkJoin, setCheckJoin] = useState(false);

  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";
  const [members, setMembers] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.on("joinComm", (msg) => {
        setMembers(msg);
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/community/searchedCommunity/${id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setCommDetails(data.community);
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [API_BASE_URL, id]);

  const handleJoin = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/community/joinCommunity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CommunityId: id, userId: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        setCheckJoin(!checkJoin);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-yellow-50 flex flex-col">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      <div className="hidden sm:block">
        <UserNavbar noti="noti" />
      </div>
      <div className="flex-grow flex flex-col md:flex-row sm:px-4">
        <div className="hidden sm:block mb-4 md:mb-0">
          <UserSlidebar />
        </div>
        {!loading && (
          <main className="flex-grow sm:max-w-7xl">
            <section className="flex flex-col flex-grow sm:px-3">
              {/* Header */}
              <div
                style={{
                  backgroundImage: `url(${commDetails.coverPhoto})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="h-52 border-b-2 sm:border-2 border-black "
              >
                <img
                  src={commDetails.logo}
                  alt={commDetails.name}
                  className="absolute top-40 sm:top-60 sm:left-80 left-5 w-32 border border-black rounded-full h-32"
                />

                <div>
                  <div className="font-bold text-base sm:text-xl absolute top-52 sm:top-80 sm:left-[460px] left-[154px]">
                    {commDetails.name}
                  </div>
                  <div className="absolute text-xs top-[234px] text-gray-600 left-[154px]">
                    <span className="font-bold">Members : </span>
                    {commDetails.members &&
                    commDetails.members.length &&
                    members === 0
                      ? commDetails.members.length - 1
                      : members - 1}
                  </div>
                </div>
                <div className="border-b border-gray-400">
                  <div className="mt-[298px] text-sm mx-auto w-5/6">
                    {commDetails.description}
                  </div>
                  <div className="w-5/6 mx-auto mt-2 mb-5">
                    <button
                      onClick={() => handleJoin(commDetails._id)}
                      className={`${
                        commDetails.members &&
                        commDetails.members.find(
                          (member) => member._id == user._id
                        ) || checkJoin
                          ? "border-2 border-blue-500"
                          : "bg-blue-500"
                      } w-full font-bold rounded-lg p-1.5`}
                    >
                      {commDetails.members &&
                      commDetails.members.find(
                        (member) => member._id == user._id
                      ) || checkJoin
                        ? "Joined"
                        : "Join"}
                    </button>
                    <button
                    onClick={()=>navigate(`/user/commChatPost/${commDetails._id}`)}
                    className="bg-yellow-300 w-full font-bold rounded-lg p-1.5 border-2 border-yellow-500 mt-5">
                      View Community
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
};

export default CommChat;
