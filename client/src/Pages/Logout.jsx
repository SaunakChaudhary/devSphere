import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";
import { UserDataContext } from "../Context/UserContext";
import toast from "react-hot-toast";

const Logout = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    const lastSeenUpadte = async () => {
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
        toast.error(error);
      }
    };

    lastSeenUpadte();
    localStorage.removeItem("token");
    socket.emit("logout");
    navigate("/login");
  }, [API_BASE_URL, navigate, socket, user._id]);

  return <div></div>;
};

export default Logout;
