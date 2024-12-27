import "remixicon/fonts/remixicon.css";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../Context/UserContext";
import { SocketContext } from "../../Context/SocketContext";
import { toast } from "react-hot-toast";
import SyncLoader from "react-spinners/SyncLoader";
import { NavLink } from "react-router-dom";

const Notifications = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/notification/updateNotificationMode`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead: true, user: user?._id }),
          }
        );
        const data = await response.json();

        if (response.ok) {
          setNotifications(data.notification || []);
          setLoading(false);
        } else {
          toast.error(data.message || "Failed to fetch notifications");
        }
      } catch (error) {
        toast.error("Error fetching notifications: " + error.message);
      }
    };

    if (user?._id) {
      fetchData();
    }
    if (socket && user._id) {
      socket.on("newMessage", () => {
        fetchData();
      });
    }
  }, [API_BASE_URL, user?._id, socket]);

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      <UserNavbar page="home" />

      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <main className="flex-grow p-4 md:p-6 h-screen overflow-y-auto">
          <h1 className="text-3xl font-black mb-6 mt-3 ml-4 uppercase">
            Notifications
          </h1>
          {notifications.length > 0 ? (
            notifications
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((notification, idx) => (
                <div
                  key={idx}
                  className="border-l-4 p-4 mb-4 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Avatar and Notification Content */}
                    <div className="flex sm:flex-row items-start sm:items-center gap-3 w-full">
                      {/* Avatar */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <img
                          src={notification.sender.avatar}
                          alt="User Avatar"
                          className="rounded-full object-cover border border-gray-300 shadow-sm w-full h-full"
                        />
                      </div>

                      {/* Notification Content */}
                      <div className="flex-grow">
                        <p className="font-normal text-sm sm:text-base">
                          <NavLink
                            to={`/user/user_profile/${notification.sender._id}`}
                            className="font-bold"
                          >
                            {notification.sender.name}
                          </NavLink>{" "}
                          {notification.content}
                        </p>
                        {/* Timestamp for Mobile */}
                        <span className="text-xs text-gray-500 block sm:hidden mt-1 text-left">
                          {new Date(notification.createdAt).toLocaleString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Timestamp for Larger Screens */}
                    <span className="text-xs sm:text-base text-gray-600 hidden sm:block whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-600">No notifications found</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Notifications;
