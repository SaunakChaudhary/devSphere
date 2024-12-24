/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { UserDataContext } from "../../Context/UserContext";
import SyncLoader from "react-spinners/SyncLoader";

const InterestSelection = () => {
  const isLocalhost = window.location.hostname === "localhost";

  const API_BASE_URL = isLocalhost
  ? "http://localhost:5000"
  : "https://devsphere-q2y0.onrender.com";

  const navigate = useNavigate();
  const { setUser, user } = useContext(UserDataContext);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNormalUser, setIsNormalUser] = useState(false);

  useEffect(() => {
    
    const getTagsAndCategory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/hashtag/get-hashtags`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setHashtags(data);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch tags and categories " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getTagsAndCategory();
  }, []);

  const handleClick = async () => {
    if (selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:5000/hashtag/addIntoUserSchema",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            hashtags: selectedInterests,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        navigate("/dashboard?newUser=true");
        toast.success("Welcome to the community ! 🎉");
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to add interests to user schema " + error.message);
    }
  };

  const toggleInterest = (tag) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const CategorySection = ({ title, type, bgColor }) => (
    <div className="mb-8 lg:mb-12">
      <h2 className="text-xl md:text-2xl font-black mb-4 uppercase relative inline-block">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {hashtags
          .filter((tag) => tag.type === type)
          .map((tag, index) => (
            <button
              key={index}
              onClick={() => toggleInterest(tag._id)}
              className={`
                ${bgColor} px-3 sm:px-4 py-1.5 sm:py-2 
                border-2 border-black font-bold text-sm sm:text-base
                hover:-translate-y-1 transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${
                  selectedInterests.includes(tag._id)
                    ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-100"
                    : "opacity-70 hover:opacity-90"
                }
                focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                active:translate-y-0
              `}
            >
              #{tag.tag}
            </button>
          ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
        <SyncLoader color="skyblue" loading={isLoading} size={15} />
      </div>
    );
  }

  const updateRole = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/auth/manual-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "organization",
          userId: user._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        navigate("/organization-signup");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update role " + error.message);
    }
  };

  return (
    <>
      {isNormalUser ? (
        <div className="min-h-screen bg-yellow-50 p-3 sm:p-4 md:p-6 lg:p-8">
          <main className="max-w-6xl mx-auto">
            <div className="bg-white border-4 border-black p-4 sm:p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 uppercase text-center">
                What&apos;s Your Tech Stack?
              </h1>
              <p className="text-base sm:text-lg font-bold text-center mb-6 sm:mb-8 px-2">
                Select at least 3 technologies you&apos;re interested in or work
                with
              </p>

              <div className="space-y-6 sm:space-y-8">
                <CategorySection
                  title="Languages"
                  type="languages"
                  bgColor="bg-green-300"
                />
                <CategorySection
                  title="Frontend"
                  type="frontend"
                  bgColor="bg-purple-300"
                />
                <CategorySection
                  title="Backend"
                  type="backend"
                  bgColor="bg-orange-300"
                />
                <CategorySection
                  title="Other"
                  type="other"
                  bgColor="bg-red-300"
                />
              </div>
            </div>

            <div className="text-center space-y-4 sm:space-y-6">
              <div className="inline-block bg-white border-4 border-black px-4 sm:px-6 py-2 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm sm:text-base">
                  {selectedInterests.length} interests selected
                </span>
              </div>

              <button
                onClick={handleClick}
                className={` sm:ml-3
              w-full sm:w-auto bg-cyan-300 text-black px-6 sm:px-8 py-2 sm:py-2 
              border-4 border-black font-bold text-sm sm:text-base
              ${
                selectedInterests.length >= 3
                  ? "hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                  : "opacity-50 cursor-not-allowed"
              }
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            `}
              >
                Continue
              </button>
            </div>
          </main>
        </div>
      ) : (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 uppercase text-center">
              Select Your Role
            </h1>
            <p className="text-base sm:text-lg font-bold text-center mb-6">
              Are you joining as an Organization or a Normal User?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setIsNormalUser(true);
                }}
                className="bg-green-300 text-black px-6 py-2 border-4 border-black font-bold text-sm sm:text-base hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Normal User
              </button>

              <button
                onClick={updateRole}
                className="bg-blue-300 text-black px-6 py-2 border-4 border-black font-bold text-sm sm:text-base hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterestSelection;
