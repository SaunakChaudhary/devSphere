/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { UserDataContext } from "../../Context/UserContext";
import toast from "react-hot-toast";

const ProjectSubmission = () => {
  const { user } = useContext(UserDataContext);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [allhashTags, setAllHashtags] = useState([]);
  const [filteredHashtags, setFilteredHashtags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [users, setUsers] = useState([]);

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

  const [formData, setFormData] = useState({
    title: "",
    githubRepo: "",
    demoUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sendData = {
        title: formData.title,
        githubRepo: formData.githubRepo,
        demoUrl: formData.demoUrl,
        technologies,
        description: text,
        tagedUsers: arr,
        userId: user?._id,
      };
      console.log(sendData)
      const response = await fetch(`${API_BASE_URL}/project/addProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // Description
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [cursorPos, setCursorPos] = useState(0);

  const showSuggestions = (input) => {
    const filteredUsers = users.filter((user) =>
      user.username.startsWith(input)
    );
    setSuggestions(filteredUsers);
  };

  const [arr, setArr] = useState([]);

  const insertUser = (username) => {
    const newText = text.slice(0, text.lastIndexOf("@")) + "@" + username + " ";

    setArr((prev) => [...prev, username]);

    setText(newText);
    setSuggestions([]);
    setCursorPos(newText.length);
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    const cursorPosition = e.target.selectionStart;

    setText(newText);
    setCursorPos(cursorPosition);

    const atPosition = newText.lastIndexOf("@", cursorPosition);
    if (atPosition !== -1 && cursorPosition > atPosition) {
      const substring = newText.slice(atPosition + 1, cursorPosition);
      setCurrentInput(substring);
      showSuggestions(substring);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      <UserNavbar page="Create" />

      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />
        <div className="mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10 w-full max-w-4xl">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-black mb-8 flex items-center gap-4">
            <span>
              Share Your Awesome Project
              <i className=" ml-2 ri-lightbulb-flash-fill text-yellow-500 text-3xl"></i>
            </span>
          </h1>
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

            {/* Technologies Used */}
            <div className="mb-6">
              <label className="block text-xl font-bold mb-2">
                <span className="whitespace-nowrap">Technologies Used : </span>
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

            {/* Project Description */}
            <div className="mb-6">
              <label className="text-xl font-bold mb-2 block">
                Project Description <span className="text-red-500">*</span> :
                <span className="font-normal text-xs ml-2">
                  (You can mention your partner by typing &apos;@&apos; followed
                  by their name, and selecting the appropriate suggestion from
                  the list.)
                </span>
              </label>
              <textarea
                name="description"
                value={text}
                onChange={handleChange}
                className="w-full p-4 text-lg border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[200px] rounded-lg"
                placeholder="Tell us about your project..."
              />
              <div style={{ position: "relative" }}>
                {suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      width: "100%",
                      maxHeight: "200px",
                      overflowY: "auto",
                      borderRadius: "8px", // Rounded corners for a modern look
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Slight shadow for depth
                      zIndex: 1000, // Ensure it appears on top
                    }}
                  >
                    {suggestions.map((user, index) => (
                      <div
                        key={index}
                        className="suggestion"
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          backgroundColor: "#f9f9f9",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px", // Space between image and text
                          borderBottom: "1px solid #ddd", // Divider between suggestions
                          transition: "background-color 0.3s ease", // Smooth hover effect
                        }}
                        onClick={() => insertUser(user.username)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#e5e5e5"; // Hover effect
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#f9f9f9"; // Reset hover effect
                        }}
                      >
                        <img
                          src={user.avatar || "/default-avatar.png"} // Default image if no avatar
                          alt={user.username}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%", // Circular avatar
                            objectFit: "cover", // Crop image to fit
                          }}
                        />
                        <span style={{ fontWeight: "bold", color: "#333" }}>
                          {user.username}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                value={formData.githubRepo}
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
              <button className="w-full sm:w-auto bg-white text-black font-bold py-4 px-8 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-500 text-white font-bold py-4 px-8 border-4 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] rounded-lg"
              >
                Submit Project
                <i className="ri-send-plane-fill text-xl ml-2"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
