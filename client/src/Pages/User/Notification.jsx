import "remixicon/fonts/remixicon.css";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../Context/SocketContext";
import {toast} from "react-hot-toast"

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  
  const typeStyles = {
    success: "bg-green-300 border-green-500",
    info: "bg-blue-300 border-blue-500",
    warning: "bg-yellow-300 border-yellow-500",
    error: "bg-red-300 border-red-500",
  };
  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="home" />

      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <main className="flex-grow p-4 md:p-6">
          <h1 className="text-3xl font-black mb-6 mt-3 ml-4 uppercase">
            Notifications
          </h1>
          {notifications.map((notification,idx) => (
            <div
              key={idx}
              className={`border-l-4 p-4 mb-4 ${
                typeStyles[notification.type]
              } shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold">{notification.message}</p>
                <span className="text-sm text-gray-600">11.00</span>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Notifications;
