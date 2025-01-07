/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "./UserContext";
import toast from "react-hot-toast";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { user } = useContext(UserDataContext);
  const isLocalhost = window.location.hostname === "localhost";

  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const prevOnlineUsersRef = useRef([]);

  useEffect(() => {
    if (user && user._id) {
      const newSocket = io(API_BASE_URL, {
        query: { userId: user._id },
        reconnection: true,
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      setSocket(newSocket);

      // Notify server when the tab is closed
      const handleTabClose = () => {
        newSocket.emit("logout", user._id);
        newSocket.close(); // Close the socket connection
      };

      window.addEventListener("beforeunload", handleTabClose);

      newSocket.on("getOnlineUsers", (onlineUsers) => {

        // Check if the current user is no longer online
        const isCurrentUserOffline = !onlineUsers.includes(user._id);

        if (isCurrentUserOffline) {
          const lastSeenUpdate = async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/user/updateLastSeen/${user._id}`,
                {
                  method: "PUT",
                }
              );
              const data = await response.json();
              if (!response.ok) toast.error(data.message);
            } catch (error) {
              toast.error(error.message || "Error updating last seen");
            }
          };
          lastSeenUpdate();
        }

        // Update the online users state and reference
        setOnlineUsers(onlineUsers);
        prevOnlineUsersRef.current = onlineUsers;
      });

      return () => {
        window.removeEventListener("beforeunload", handleTabClose);
        newSocket.off();
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
