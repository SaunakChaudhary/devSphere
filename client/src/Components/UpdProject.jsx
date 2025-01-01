/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import { UserDataContext } from "../Context/UserContext";
import SyncLoader from "react-spinners/SyncLoader";

const UpdProject = ({
  title,
  userImage,
  Name,
  username,
  setUpdProject,
  description,
  githublink,
  demoUrl,
  projectId,
  projectTechnologies,
}) => {
  const { user } = useContext(UserDataContext);

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";
  const [isLoading, setIsLoading] = useState(false);

  const [allhashTags, setAllHashtags] = useState([]);
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [technologies, setTechnologies] = useState(projectTechnologies);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: title,
    description: description,
    githublink: githublink,
    demoUrl: demoUrl,
    projectTechnologies: projectTechnologies,
  });

  useEffect(() => {
    const getAllHashtags = async () => {
      const response1 = await fetch(`${API_BASE_URL}/hashtag/get-hashtags`, {
        method: "GET",
      });
      const data1 = await response1.json();
      if (response1.ok) {
        setAllHashtags(data1);
      } else {
        toast.error(data1.message);
      }
    };

    const getAllUsers = async () => {
      const response = await fetch(`${API_BASE_URL}/auth/getAllUser`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.user);
      } else {
        toast.error(data.message);
      }
    };
    getAllUsers();
    getAllHashtags();
  }, [API_BASE_URL]);

  useEffect(() => {
    const arr = [];
    if (currentTag) {
      allhashTags?.forEach((hashtag) => {
        const fetchtag = hashtag.tag;
        const fetchCounts = hashtag.count;
        const fetchId = hashtag._id;
        const regex = new RegExp(currentTag, "i");
        if (regex.test(fetchtag)) {
          arr.push({
            hashtag: fetchtag,
            count: fetchCounts,
            id: fetchId,
          });
        }
      });
    }
    setFilteredHashtags(arr);
  }, [currentTag, allhashTags]);

  const handleAddHashtag = () => {
    if (currentTag) {
      const result = allhashTags.find((item) => item.tag === currentTag);
      if (result && !technologies.find((item) => item.tag === result.tag)) {
        setTechnologies((prev) => [...prev, result]);
        setCurrentTag("");
      } else {
        toast.error("Hashtag Already in your list");
      }
    }
  };

  const removeTag = (index) => {
    setTechnologies((prevState) => {
      return prevState.filter((_, i) => i !== index);
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const descData = formData.description || "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(descData, "text/html");
      const anchorTags = doc.querySelectorAll("a");
      const anchorContents = Array.from(anchorTags).map(
        (anchor) => anchor.textContent
      );

      // Ensure users and username are properly handled
      const filteredTags = anchorContents
        .filter((tag) => {
          if (tag.charAt(0) === "@") {
            const username = tag.split("@")[1]; // Extract username
            return users.some((user) => user.username === username); // Ensure users.username exists
          }
          return false;
        })
        .map((tag) => tag.split("@")[1]);
      const notFilteredTags = anchorContents.filter((tag) => {
        if (tag.charAt(0) === "@") {
          const username = tag.split("@")[1]; // Extract username
          return !users.some((user) => user.username === username); // Ensure users.username exists
        }
        return false;
      });

      if (notFilteredTags.length > 0) {
        toast.error(
          `${notFilteredTags.join(", ")} ${
            notFilteredTags.length > 1 ? "are" : "is"
          } not available.`
        );
        return; // Prevent form submission if there are invalid tags
      }

      const sendData = {
        title: formData.title,
        githubRepo: formData.githubRepo,
        demoUrl: formData.demoUrl,
        technologies, // Assuming technologies is defined
        description: formData.description.replace("_blank", "_self"),
        userId: user?._id, // Safely access user._id
        tagedUsers: filteredTags,
        projectId: projectId,
      };
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/project/editProject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        toast.success(data.message);
        setUpdProject(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-45 overflow-y-auto">
      {isLoading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={isLoading} size={15} />
        </div>
      )}
      <button
        onClick={() => setUpdProject(false)}
        className="absolute top-2 right-2 text-white w-12 h-12 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none font-bold text-2xl"
        aria-label="Close"
      >
        ✕
      </button>
      <div className="min-h-screen py-12 px-4">
        <div className="w-full max-w-4xl bg-white border-4 border-black p-4 md:p-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mx-auto">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={userImage}
              alt={Name}
              className="w-8 h-8 md:w-16 md:h-16 border-2 border-black"
            />
            <div>
              <h3 className="font-bold md:text-2xl">{Name}</h3>
              <h5 className="text-gray-500 text-xs md:text-base">
                @{username}
              </h5>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Project Title */}
            <div className="mb-6">
              <label className="block text-xl font-bold mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-4 text-lg border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
                placeholder="What's your project called?"
              />
            </div>

            {/* Project Description */}
            <div className="mb-6">
              <label className="text-xl font-bold mb-2 block">
                Project Description
                <span className="text-red-500">*</span> :
                <span className="font-normal text-xs ml-2">
                  (You can mention your partner by typing &apos;@&apos; followed
                  by their username, and select the text and click on link icon.
                  the list.)
                </span>
              </label>
              <ReactQuill
                value={formData.description}
                onChange={handleDescriptionChange}
                className="w-full p-4 text-lg border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[200px] rounded-lg"
                placeholder="Tell us about your project..."
              />
            </div>

            {/* Technologies Used */}
            <div className="mb-6">
              <label className="block text-xl font-bold mb-2">
                <span className="whitespace-nowrap">Hashtags</span>
                <span className="text-red-500">*</span> :
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="w-full p-4 text-lg border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
                  placeholder="Add hashtags (e.g. javascript, webdev)"
                />
                <div
                  onClick={handleAddHashtag}
                  className="rounded-lg cursor-pointer bg-green-500 text-white font-bold py-3 px-6 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                >
                  Add
                </div>
              </div>
              <div className="mt-5">
                {filteredHashtags.slice(0, 5).map((abc, idx) => {
                  return (
                    <div
                      className="w-full bg-blue-200 my-2 p-3 font-bold shadow-[2px_2px_0px_0px] cursor-pointer"
                      key={idx}
                      onClick={() => setCurrentTag(abc.hashtag)}
                    >
                      {`#${abc.hashtag}  (${abc.count})`}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mb-4 flex-wrap mt-8 max-h-48 overflow-y-auto">
                {technologies.map((hashtag, index) => (
                  <span
                    key={index}
                    className={`
                            ${hashtag.type === "languages" && "bg-green-400"}
                            ${hashtag.type === "frontend" && "bg-purple-400"}
                            ${hashtag.type === "backend" && "bg-orange-400"}
                            ${hashtag.type === "other" && "bg-red-400"}
                             text-white px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-bold flex items-center gap-2`}
                  >
                    #{hashtag.tag}
                    <div
                      onClick={() => removeTag(index)}
                      className="cursor-pointer hover:text-red-400"
                    >
                      <i className="ri-close-line"></i>
                    </div>
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Repo */}
            <div className="mb-6">
              <label className="block text-xl font-bold mb-2">
                GitHub Repository <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="githubRepo"
                value={formData.githublink}
                onChange={handleInputChange}
                className="w-full p-4 text-lg border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* Demo URL */}
            <div className="mb-6">
              <label className="block text-xl font-bold mb-2">Demo URL</label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                className="w-full p-4 text-lg border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all rounded-lg"
                placeholder="https://your-demo-url.com"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => setUpdProject(false)}
                className="w-full sm:w-auto bg-white text-black font-bold py-4 px-8 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-500 text-white font-bold py-4 px-8 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-lg"
              >
                Edit Project
                <i className="ri-send-plane-fill text-xl ml-2"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdProject;
