/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../Context/SocketContext";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";

const UserNavbar = ({ page }) => {
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";
  const { user } = useContext(UserDataContext);
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
      });

      return () => {
        socket.off("newMessage"); // Clean up listener on unmount
      };
    }
  }, [socket]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    const countNotiFunc = async () => {
      const response = await fetch(
        `${API_BASE_URL}/notification/notificationCount/${user._id}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCount(data.count);
      }
    };
    if(user._id) countNotiFunc();
    if (user._id && socket) {
      socket.on("newMessage", () => {
        countNotiFunc();
      });
    }

  }, [API_BASE_URL, socket, user._id]);

  return (
    <div>
      {/* Navbar */}
      <div className="p-4">
        <nav className="bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] py-4 px-6 border-2  border-black flex justify-between items-center">
          <h1 className="flex items-center text-2xl font-black text-black">
            <i className="mr-2 ri-terminal-window-line text-3xl"></i>
            <span>DevSphere</span>
          </h1>
          <div className="hidden md:flex gap-6 items-center">
            <NavLink
              to="/dashboard"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Home
            </NavLink>
            <NavLink
              to="/user/notification"
              className="text-black font-bold hover:underline hover:text-blue-700 flex items-center"
            >
              Notifications{" "}
              {count > 0 &&<div className="text-white relative bottom-2 rounded-full w-4 text-sm h-4 bg-red-500 z-50 flex justify-center items-center">
                {count}
              </div>}
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
              {count === 0 ? (
                <i className="mr-3 ri-notification-badge-line text-2xl active:text-red-500"></i>
              ) : (
                <i className="mr-3 ri-notification-badge-fill text-2xl active:text-red-700 text-red-500"></i>
              )}
            </NavLink>
            <NavLink to="/user/chat" className="text-black font-bold">
              <i className="ri-chat-smile-3-line text-2xl active:text-red-500"></i>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* For Mobile View Slidebar */}
      <div className="fixed bottom-0 w-full bg-white h-20 flex sm:hidden justify-evenly items-center z-10">
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
