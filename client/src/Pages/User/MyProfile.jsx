import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../../Context/UserContext";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import { SocketContext } from "../../Context/SocketContext";
import DetailedProject from "../../Components/DetailedProject";
import UpdProject from "../../Components/UpdProject";
import CommentSection from "../../Components/CommentComponent";

const MyProfile = () => {
  const { socket } = useContext(SocketContext);

  const [delteUp, setDeleteUp] = useState(false);
  const [updProject, setUpdProject] = useState(false);
  const navigate = useNavigate();
  const [showFullBio, setShowFullBio] = useState(false);

  const [followers, setFollowers] = useState("");
  const [following, setFollowing] = useState("");

  const isLocalhost = window.location.hostname === "localhost";

  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const { user } = useContext(UserDataContext);
  const [userDetails, setuserDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState([]);

  const handleTogle = (index) => {
    setEdit((prevEdit) => {
      const newEdit = [...prevEdit];
      if (newEdit[index] === undefined) {
        newEdit[index] = true;
      } else {
        newEdit[index] = !newEdit[index];
      }
      return newEdit;
    });
  };

  useEffect(() => {
    const userDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/search/searchedUser/${user?._id}`
        );
        const data = await response.json();
        if (response.ok) setuserDetails(data.userData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (user._id) {
      userDetail();
    }
  }, [API_BASE_URL, user?._id, user]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/displayAllCounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setFollowers(data.countFollowers);
        setFollowing(data.countFollowing);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    };

    if (user._id) fetchData();
    if (socket && user._id) {
      socket.on("newMessage", () => {
        fetchData();
      });
      socket.on("unFollowUpdate", () => {
        fetchData();
      });
    }
  }, [API_BASE_URL, socket, user._id, delteUp]);

  const userData = {
    points: 1250,
    level: "Pro Developer",
    memberSince: "Jan 2023",
    stats: {
      contributions: 456,
    },
  };

  const [projects, setProjects] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/project/fetchProjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user?._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects);
        setCount(data.count);
        setDeleteUp(false);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    };
    if (user?._id) fetchProjects();
  }, [API_BASE_URL, user?._id, delteUp, updProject]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/project/deleteProject`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Set header for JSON data
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setDeleteUp(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleLike = async (projectId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/project/likeUnlikePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, userId: user._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setDeleteUp(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const targetDivRef = useRef(null);

  const handleScrollToDiv = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const [edit1, setEdit1] = useState([]);
  const [dispProject, setDispProject] = useState([]);

  const handleDispProject = (index) => {
    setDispProject((prevDispProject) => {
      const newDispProject = [...prevDispProject];
      newDispProject[index] = !newDispProject[index];
      return newDispProject;
    });
  };

  const handleComment = (projectId,index) => {
    setEdit1((prevEdit) => {
      const newEdit = [...prevEdit];
      const ch = newEdit[index];
      newEdit.fill(false);
      if (newEdit[index] === undefined) {
        newEdit[index] = true;
      } else {
        newEdit[index] = !ch;
      }
      return newEdit;
    });
  };
  return (
    <div className="bg-yellow-50 min-h-screen">
      {isLoading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={isLoading} size={15} />
        </div>
      )}
      <UserNavbar page="MyProfile" />
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
                        src={userDetails?.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1
                      className={`text-3xl font-black mb-2 ${
                        userDetails &&
                        userDetails?.name &&
                        userDetails?.name.length > 25
                          ? "md:text-3xl"
                          : "md:text-4xl"
                      }`}
                    >
                      {userDetails?.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-2 font-semibold">
                      @{userDetails?.username}
                    </p>
                    <p className="text-gray-700 mb-4 text-sm font-semibold text-start">
                      {!showFullBio &&
                      userDetails?.bio &&
                      userDetails?.bio.length > 80
                        ? `${userDetails?.bio.substring(0, 80)}`
                        : userDetails?.bio}
                      {userDetails?.bio?.length > 80 && (
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
                      <button
                        onClick={() => navigate("/user/edit-profile")}
                        className="bg-blue-300 text-black font-bold py-2 px-6 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                      >
                        <i className="ri-user-settings-fill"></i> Edit Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div
                    onClick={() =>
                      navigate(
                        `/user/dispfollowList?follow=Followers&id=${userDetails?._id}`
                      )
                    }
                    className="cursor-pointer bg-yellow-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-black">{followers}</p>
                      <p className="text-gray-700 font-bold">Followers</p>
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      navigate(
                        `/user/dispfollowList?follow=Followings&id=${userDetails?._id}`
                      )
                    }
                    className="cursor-pointer bg-blue-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-black">{following}</p>
                      <p className="text-gray-700 font-bold">Following</p>
                    </div>
                  </div>
                  <div
                    onClick={handleScrollToDiv}
                    className="cursor-pointer bg-green-100 p-4 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="text-center">
                      <p className="text-2xl font-black">{count}</p>
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
                    {userDetails &&
                      userDetails?.interest &&
                      userDetails?.interest?.map((interest, index) => (
                        <span
                          onClick={() =>
                            navigate(`/user/projects/${interest.tag}`)
                          }
                          key={index}
                          className={`
                        ${interest.type === "languages" && "bg-green-200"}
                        ${interest.type === "frontend" && "bg-purple-200"}
                        ${interest.type === "backend" && "bg-orange-200"}
                        ${interest.type === "other" && "bg-red-200"}
                        cusor-pointer px-4 py-2 font-bold border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
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
                  <div className="w-full overflow-hidden flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <i className="ri-mail-line text-xl"></i>
                    <span>{userDetails?.email}</span>
                  </div>
                  {userDetails?.mobileNo && (
                    <div className="w-full overflow-x-auto  flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <i className="ri-phone-line text-xl"></i>
                      <span>{userDetails.mobileNo}</span>
                    </div>
                  )}
                  {userDetails?.gitHuburl && (
                    <div className="w-full overflow-x-auto  flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <i className="ri-github-fill text-xl"></i>
                      <span>{userDetails?.gitHuburl}</span>
                    </div>
                  )}
                  {userDetails?.linkedInUrl && (
                    <div className="w-full overflow-x-auto flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <i className="ri-linkedin-box-fill text-xl"></i>
                      <span>{userDetails?.linkedInUrl}</span>
                    </div>
                  )}
                  {userDetails.portfolioWebsite && (
                    <div className="w-full overflow-x-auto flex items-center gap-3 p-4 bg-gray-100 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] md:col-span-2">
                      <i className="ri-global-line text-xl"></i>
                      <span>{userDetails.portfolioWebsite}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects Section */}
              <div
                ref={targetDivRef}
                style={{
                  padding: "20px",
                }}
                className="bg-white border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8 mb-20"
              >
                <h2 className="text-2xl font-bold mb-4">Projects</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {projects.length === 0
                    ? "No Project Uploaded"
                    : projects.map((project, index) => (
                        <div
                          key={index}
                          className="bg-white border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                        >
                          <div className="p-4 relative">
                            <div className="flex justify-between">
                              <NavLink
                                to={`/user/user_profile/${project.userId._id}`}
                                className="flex items-center gap-3 mb-4"
                              >
                                <img
                                  src={project.userId.avatar}
                                  alt={project.username}
                                  className="w-8 h-8 md:w-10 md:h-10 border-2 border-black"
                                />
                                <div>
                                  <h3 className="font-bold">
                                    {project.userId.name}
                                  </h3>
                                  <h5 className="text-gray-500 text-xs">
                                    @{project.userId.username}
                                  </h5>
                                </div>
                              </NavLink>
                              <i
                                onClick={() => handleTogle(index)}
                                className="ri-more-2-fill cursor-pointer"
                              ></i>
                            </div>
                            {edit[index] && (
                              <div className="absolute top-12 right-4">
                                <button
                                  onClick={() => setUpdProject(true)}
                                  className="block mb-1 text-yellow-500 font-semibold px-2 border shadow-[1px_1px_0px_black] border-black w-24 bg-white"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(project._id)}
                                  className="block text-red-500 font-semibold px-2 border shadow-[1px_1px_0px_black] border-black w-24 bg-white"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                            <h4 className="text-lg md:text-xl font-black mb-4">
                              {project.title}
                            </h4>
                            <p
                              className="mb-3 text-gray-600 project-description"
                              dangerouslySetInnerHTML={{
                                __html:
                                  project.description.length > 500
                                    ? project.description?.substring(0, 150) +
                                      "..."
                                    : project.description,
                              }}
                            ></p>
                            <div
                              className="block mb-4 text-blue-500 font-semibold cursor-pointer"
                              onClick={() => handleDispProject(index)}
                            >
                              Read more ...
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech, techIndex) => (
                                <span
                                  onClick={() =>
                                    navigate(`/user/projects/${tech.tag}`)
                                  }
                                  key={techIndex}
                                  className="cursor-pointer bg-gray-100 px-2 py-1 text-sm font-bold border-2 border-black"
                                >
                                  #{tech.tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                              <button
                                onClick={() => handleLike(project._id)}
                                className="flex items-center gap-1 transition-colors"
                              >
                                <i
                                  className={`${
                                    project.likes.includes(user._id)
                                      ? "ri-heart-fill text-red-500"
                                      : "ri-heart-line"
                                  }`}
                                />
                                <span className="text-sm">
                                  {project.likes.length}
                                </span>
                              </button>
                              <button
                                onClick={() => handleComment(project._id,index)}
                                className="flex items-center gap-1 transition-colors"
                              >
                                <span className="flex items-center gap-1">
                                  <i className="ri-chat-1-line"></i>
                                  <span className="text-sm">
                                    {project.comment.length}
                                  </span>
                                </span>
                              </button>
                            </div>
                          </div>
                          {edit1[index]  && (
                            <CommentSection projectId={project._id} />
                          )}
                          {dispProject[index] && (
                            <DetailedProject
                              title={project.title}
                              userImage={project.userId.avatar}
                              Name={project.userId.name}
                              username={project.userId.username}
                              setDispProject={setDispProject}
                              description={project.description}
                              githublink={project.githubRepo}
                              demoUrl={project?.demoUrl || ""}
                              projectTechnologies={project.technologies}
                              index={index}
                            />
                          )}

                          {updProject && (
                            <UpdProject
                              projectId={project._id}
                              title={project.title}
                              userImage={project.userId.avatar}
                              Name={project.userId.name}
                              username={project.userId.username}
                              setUpdProject={setUpdProject}
                              description={project.description}
                              githublink={project.githubRepo}
                              demoUrl={project?.demoUrl || ""}
                              projectTechnologies={project.technologies}
                            />
                          )}
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

export default MyProfile;
