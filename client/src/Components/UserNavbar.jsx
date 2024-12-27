/* eslint-disable react/prop-types */

import { useContext, useEffect } from "react";
import { SocketContext } from "./../Context/SocketContext";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";

const UserNavbar = ({ page }) => {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (msg) => {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={msg.user.avatar}
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {msg.user.name + " " + msg.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ));
        // toast(msg.user.name + " " + msg.message);
      });

      return () => {
        socket.off("newMessage"); // Clean up listener on unmount
      };
    }
  }, [socket]);

  return (
    <div>
      {/* Navbar */}
      <div className="p-4">
        <nav className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-4 px-6 border-4 border-black flex justify-between items-center">
          <h1 className="flex items-center text-2xl font-black text-black">
            <i className="mr-2 ri-terminal-window-line text-3xl"></i>
            <span>DevSphere</span>
          </h1>
          <div className="hidden md:flex gap-6">
            <NavLink
              to="/dashboard"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Home
            </NavLink>
            <NavLink
              to="/user/notification"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Notifications
            </NavLink>
            <NavLink
              to="/logout"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Logout
            </NavLink>
          </div>
          <div className="block sm:hidden ">
            <NavLink
              to="/user/achievements"
              className="text-black font-bold mr-3"
            >
              <span className="text-2xl">🏆</span>
            </NavLink>
            <NavLink to="/user/notification" className="text-black font-bold">
              <i className="mr-3 ri-notification-badge-line text-2xl active:text-red-500"></i>
            </NavLink>
            <NavLink to="/logout" className="text-black font-bold">
              <i className="ri-logout-box-r-line text-2xl active:text-red-500"></i>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* For Mobile View Slidebar */}
      <div className="fixed bottom-0 w-full bg-white h-20 flex sm:hidden justify-evenly items-center">
        <div className="p-3">
          <NavLink to="/dashboard">
            <i
              className={`ri-home-4-line text-3xl ${
                page === "home" && "font-extrabold"
              }`}
            ></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/search">
            <i
              className={`ri-search-line text-3xl ${
                page === "Search" && "font-extrabold"
              }`}
            ></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/create-post">
            <i
              className={`ri-add-box-line text-3xl ${
                page === "Create" && "font-extrabold"
              }`}
            ></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/challenges">
            <i
              className={`ri-trophy-line text-3xl  ${
                page === "Challenges" && "font-extrabold"
              }`}
            ></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/profile">
            <i
              className={`ri-user-3-line text-3xl ${
                page === "MyProfile" && "font-extrabold"
              }`}
            ></i>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
