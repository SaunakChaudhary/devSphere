/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserDataContext } from "./UserContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { user } = useContext(UserDataContext);
  const isLocalhost = window.location.hostname === "localhost";

  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

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
      newSocket.on("getOnlineUsers", (onlineUsers) => {
        setOnlineUsers(onlineUsers);
      });

      return () => {
        newSocket.off();
        newSocket.close();
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket,onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
