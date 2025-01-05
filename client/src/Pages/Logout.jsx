import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../Context/SocketContext";

const Logout = () => {
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    socket.emit("logout");
    navigate("/login");
  }, [navigate, socket]);

  return <div></div>;
};

export default Logout;
