import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Redirect = () => {
  const navigate = useNavigate();
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const location = useLocation();

  // Extract username from URL
  const extractUsername = () => {
    const path = location.pathname;
    const username = path.split("@")[1];
    return username || null; // Return null if no username is found
  };

  const username = extractUsername();

  useEffect(() => {
    if (!username) {
      toast.error("No username found in the URL.");
      return;
    }

    const getUserId = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/search/redirectUser/${username}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const data = await response.json();
          toast.error(data.message || "Failed to fetch user data.");
          return;
        }

        const data = await response.json();
        navigate(`/user/user_profile/${data.userData._id}`); // Redirect on successful ID fetch
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
        console.error(error);
      }
    };

    getUserId();
  }, [API_BASE_URL, navigate, username]);

  return null; // No visible UI is needed for this component
};

export default Redirect;
