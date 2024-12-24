/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useEffect, useContext } from "react";
import { UserDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserProtected = ({ children }) => {
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const token = localStorage.getItem("token");

  const getUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/get-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        toast.error(data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error while fetching user data " + error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getUserData();
    }
  }, [token]);

  return <>{children}</>;
};

export default UserProtected;
