import { useState, useEffect, useContext } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { UserDataContext } from "../../Context/UserContext";
import DetailedProject from "../../Components/DetailedProject";

const ProjectsHashtag = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { id } = useParams();
  const { user } = useContext(UserDataContext);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const [dispProject, setDispProject] = useState(false);
  const [checkLiked, setCheckLiked] = useState(false);

  useEffect(() => {
    const searchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/search/getSearchResults?search=${id}`,
          { method: "GET" }
        );
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data.projects);
        } else {
          toast.error(data.message || "Failed to fetch projects");
        }
      } catch (error) {
        toast.error("An error occurred while fetching projects");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    searchData();
  }, [API_BASE_URL, id, checkLiked]);

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
        setCheckLiked(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      {isLoading && (
        <div
          className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50"
          aria-busy="true"
        >
          <SyncLoader color="skyblue" loading={isLoading} size={15} />
        </div>
      )}

      <UserNavbar />
      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />
        <div className="flex flex-col w-full md:w-3/4 p-4 mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-10">
            Projects with #{id}
          </h1>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result) => (
                <div key={result._id}>
                  <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 hover:-translate-y-1 transition-transform cursor-pointer">
                    <h3 className="font-black text-lg mb-2">{result.title}</h3>
                    <p
                      className="text-gray-600 mb-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          result.description.length > 500
                            ? result.description?.substring(0, 150) + "..."
                            : result.description,
                      }}
                    ></p>
                    <div
                      className="block mb-4 text-blue-500 font-semibold cursor-pointer"
                      onClick={() => setDispProject(true)}
                    >
                      Read more ...
                    </div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {result.technologies.map((tag) => (
                        <span
                          key={tag._id}
                          className="px-2 py-1 bg-blue-100 border-2 border-black text-sm font-bold"
                        >
                          #{tag.tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span
                        onClick={() =>
                          navigate(`/user/user_profile/${result.userId._id}`)
                        }
                        className="flex items-center gap-1"
                      >
                        <i className="ri-user-line"></i>
                        {result.userId.username}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLike(result._id)}
                          className="flex items-center gap-1 transition-colors"
                        >
                          <i
                            className={`${
                              result.likes.includes(user._id)
                                ? "ri-heart-fill text-red-500"
                                : "ri-heart-line"
                            }`}
                          />
                          <span className="text-sm">{result.likes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {dispProject && (
                    <DetailedProject
                      title={result.title}
                      userImage={result.userId.avatar}
                      Name={result.userId.name}
                      username={result.userId.username}
                      setDispProject={setDispProject}
                      description={result.description}
                      githublink={result.githubRepo}
                      demoUrl={result?.demoUrl || ""}
                      projectTechnologies={result.technologies}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mt-4">No projects found for #{id}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsHashtag;
