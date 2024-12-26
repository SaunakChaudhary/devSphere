import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const UserProfile = () => {
  const [showFullBio, setShowFullBio] = useState(false);

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const { id } = useParams();
  const [user, setUser] = useState([]);

  useEffect(() => {
    const userDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/search/searchedUser/${id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data.userData);
        }
      } catch (error) {
        toast.error(error);
      }
    };
    userDetails();
  }, [API_BASE_URL, id]);

  const userData = {
    name: "Sarah Wilson",
    username: "@sarahw",
    bio: "Frontend Developer | UI/UX Enthusiast | Coffee Lover",
    email: "sarah.wilson@example.com",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    points: 1250,
    level: "Pro Developer",
    memberSince: "Jan 2023",
    github: "github.com/sarahw",
    linkedin: "linkedin.com/in/sarahw",
    website: "sarahwilson.dev",
    stats: {
      followers: 1234,
      following: 567,
      projects: 28,
      contributions: 456,
    },
    interests: [
      { tag: "javascript", type: "languages" },
      { tag: "react", type: "frontend" },
      { tag: "nodejs", type: "backend" },
      { tag: "typescript", type: "languages" },
      { tag: "tailwind", type: "frontend" },
    ],
    projects: [
      {
        title: "E-Commerce Dashboard",
        description:
          "A comprehensive dashboard for managing online store operations",
        tech: ["React", "Node.js", "MongoDB"],
        likes: 234,
        comments: 45,
        image: "/api/placeholder/300/200",
      },
      {
        title: "Social Media Analytics Tool",
        description: "Real-time analytics platform for social media management",
        tech: ["Vue.js", "Python", "PostgreSQL"],
        likes: 189,
        comments: 32,
        image: "/api/placeholder/300/200",
      },
      {
        title: "Task Management App",
        description: "Collaborative task management solution for remote teams",
        tech: ["React Native", "Firebase"],
        likes: 156,
        comments: 28,
        image: "/api/placeholder/300/200",
      },
    ],
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      <UserNavbar />
      {/* Top Info Bar */}
      <div className="bg-gray-900 text-white py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6 md:gap-12 items-center">
          <div className="flex gap-6 md:gap-12 flex-wrap justify-center items-center">
            {/* Level */}
            <span className="flex items-center gap-2 text-sm md:text-base">
              <i className="ri-medal-line text-yellow-400"></i>
              <span>Level: {userData.level}</span>
            </span>

            {/* Points */}
            <span className="flex items-center gap-2 text-sm md:text-base">
              <i className="ri-coin-line text-green-400"></i>
              <span>{userData.points} Points</span>
            </span>

            {/* Member Since */}
            <span className="flex items-center gap-2 text-sm md:text-base">
              <i className="ri-calendar-line text-blue-400"></i>
              <span>Member since {userData.memberSince}</span>
            </span>

            {/* Contributions */}
            <span className="flex items-center gap-2 text-sm md:text-base">
              <i className="ri-git-commit-line text-purple-400"></i>
              <span>{userData.stats.contributions} Contributions</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />

        <div className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Main Profile Card */}
            <div className="mb-6">
              {/* Profile Header */}
              <div className="bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8 mb-6">
                <div className=" flex flex-col md:flex-row items-center gap-6 mb-8">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-black overflow-hidden rounded-full">
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1
                      className={`text-3xl font-black mb-2 ${
                        user && user.name && user.name.length > 25
                          ? "md:text-3xl"
                          : "md:text-4xl"
                      }`}
                    >
                      {user.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-2 font-semibold">
                      @{user.username}
                    </p>
                    <p className="text-gray-700 mb-4 text-sm font-semibold text-start">
                      {!showFullBio &&
                      user?.bio &&
                      user?.bio.length > 80
                        ? `${user?.bio.substring(0, 80)}`
                        : user?.bio}
                      {user?.bio?.length > 80 && (
                        <button
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="text-blue-500 hover:underline text-sm font-semibold ml-1"
                        >
                          {showFullBio ? " Show Less" : " Show More"}
                        </button>
                      )}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <button className="bg-blue-300 text-black font-bold py-2 px-6 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                        <i className="ri-user-add-line mr-2"></i>Follow
                      </button>
                      <button className="bg-green-300 text-black font-bold py-2 px-6 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                        <i className="ri-chat-3-line mr-2"></i>Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-yellow-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <p className="text-2xl font-black">
                        {userData.stats.followers}
                      </p>
                      <p className="text-gray-700 font-bold">Followers</p>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <p className="text-2xl font-black">
                        {userData.stats.following}
                      </p>
                      <p className="text-gray-700 font-bold">Following</p>
                    </div>
                  </div>
                  <div className="bg-green-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <p className="text-2xl font-black">
                        {userData.stats.projects}
                      </p>
                      <p className="text-gray-700 font-bold">Projects</p>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-center">
                      <p className="text-2xl font-black">{userData.points}</p>
                      <p className="text-gray-700 font-bold">Points</p>
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Interests</h2>
                  <div className="flex flex-wrap gap-2">
                    {user &&
                      user.interest &&
                      user.interest.map((interest, index) => (
                        <span
                          key={index}
                          className={`
                        ${interest.type === "languages" && "bg-green-200"}
                        ${interest.type === "frontend" && "bg-purple-200"}
                        ${interest.type === "backend" && "bg-orange-200"}
                        ${interest.type === "other" && "bg-red-200"}
                        px-4 py-2 font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                      `}
                        >
                          #{interest.tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <i className="ri-mail-line text-xl"></i>
                    <span>{user.email}</span>
                  </div>
                  {user.mobileNo && (
                    <div className="flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <i className="ri-phone-line text-xl"></i>
                      <span>{user.mobileNo}</span>
                    </div>
                  )}
                  {user.gitHuburl && (
                    <div className="flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <i className="ri-github-fill text-xl"></i>
                      <span>{user.gitHuburl}</span>
                    </div>
                  )}
                  {user.linkedInUrl && (
                    <div className="flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <i className="ri-linkedin-box-fill text-xl"></i>
                      <span>{user.linkedInUrl}</span>
                    </div>
                  )}
                  {user.portfolioWebsite && (
                    <div className="flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
                      <i className="ri-global-line text-xl"></i>
                      <span>{user.portfolioWebsite}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects Section */}
              <div className="bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8 mb-20">
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {userData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-white border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover border-b-4 border-black"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-gray-100 px-2 py-1 text-sm font-bold border-2 border-black"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="flex items-center gap-1">
                            <i className="ri-heart-line"></i>
                            {project.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <i className="ri-chat-1-line"></i>
                            {project.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;