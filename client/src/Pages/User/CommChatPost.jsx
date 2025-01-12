import SyncLoader from "react-spinners/SyncLoader";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const CommChatPost = () => {
  const { id } = useParams();
  const [commDetails, setCommDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

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
      <div className="flex-grow flex flex-col md:flex-row sm:px-4 ">
        <div className="hidden sm:block mb-4 md:mb-0 ">
          <UserSlidebar />
        </div>

        <main className="flex-grow sm:max-w-7xl bg-yellow-50">
          <section className="bg-yellow-50 flex flex-col flex-grow sm:px-3 h-screen sm:fixed sm:w-full">
            {/* Header */}
            <h2 className="z-50 sm:border-2 flex sm:max-w-[1220px] items-center p-6 w-full gap-6 text-3xl border-black border-b font-black text-black mb-6 fixed sm:absolute bg-[#fef7cc]">
              <img
                src={commDetails.logo}
                alt={commDetails.name}
                className="w-10 h-10 rounded-full shadow-lg"
              />
              <div>
                <p className="font-bold text-base">{commDetails.name}</p>
                <p className="font-semibold text-xs text-gray-500">
                  Members :{" "}
                  {commDetails.members &&
                    commDetails.members.length &&
                    commDetails.members.length - 1}
                </p>
              </div>
            </h2>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CommChatPost;
