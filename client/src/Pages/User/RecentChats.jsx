import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../../Context/UserContext";
import { useContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import imageCompression from "browser-image-compression";
import SyncLoader from "react-spinners/SyncLoader";

const RecentChats = () => {
  const navigate = useNavigate();

  const { user, reChats, setReChats, allCommunity } =
    useContext(UserDataContext);

  const getLastSeenMessage = (lastSeen) => {
    const lastSeenDate = dayjs(lastSeen);

    if (lastSeenDate.isToday()) {
      return `${lastSeenDate.format("h:mm A")}`;
    } else if (lastSeenDate.isYesterday()) {
      return `yesterday`;
    } else {
      return `${lastSeenDate.format("MMM DD, YYYY")} at ${lastSeenDate.format(
        "h:mm A"
      )}`;
    }
  };

  const isLocalhost = window.location.hostname === "localhost";

  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const [isLoading, setIsLoading] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/message/SearchUserExceptLoggedInUser/${searchQuery}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ loggedInUser: user?._id }),
          }
        );
        const data = await response.json();

        if (response.ok) {
          setSearchResults(data);
        } else {
          toast.error(data.message || "Something went wrong.");
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 500); // Debounce 500ms delay

    return () => clearTimeout(timeoutId); // Cleanup timeout on every search query change
  }, [API_BASE_URL, searchQuery, user?._id]);

  // LongPressLogic

  const [longPressMessage, setLongPressMessage] = useState(null);

  const handleLongPress = (messageId) => {
    setLongPressMessage(messageId);
  };

  // Animation on GSP
  const OptionRef = useRef(null);
  useGSAP(
    function () {
      if (longPressMessage) {
        gsap.to(OptionRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(OptionRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [[OptionRef]]
  );

  const handleDeleteConversation = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/message/DeleteConversation`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            convId: longPressMessage,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const recentChats = await reChats.filter(
          (chat) => chat.conversationId !== longPressMessage
        );
        setReChats(recentChats);
        setLongPressMessage(null);
        toast.success(data.message);
      } else {
        // Notify the user of an error
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Error deleting conversation.");
    }
  };

  // Community Creation
  const [communityCreatePanel, setCommunityCreatePanel] = useState(false);

  const handleCreateCommunity = () => {
    setCommunityCreatePanel(true);
  };

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [privacy, setPrivacy] = useState("Public");
  const [logo, setLogo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImage1, setPreviewImage1] = useState(null);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    setLogo(file);
    if (file) {
      const options = {
        maxSizeMB: 0.2, // Max file size in MB
        maxWidthOrHeight: 800, // Max width/height of the image
        useWebWorker: true, // Use a Web Worker for compression
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleCoverPhotoChange = async (e) => {
    const file = e.target.files[0];
    setCoverPhoto(file);
    if (file) {
      const options = {
        maxSizeMB: 0.2, // Max file size in MB
        maxWidthOrHeight: 800, // Max width/height of the image
        useWebWorker: true, // Use a Web Worker for compression
      };

      // Compress the image
      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage1(reader.result);
      };
      reader.readAsDataURL(compressedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (title.length > 25) {
        toast.error("Title Length Should be Less than 25");
        setIsLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", title);
      formData.append("description", description);
      formData.append("coverPhoto", coverPhoto);
      formData.append("logo", logo);
      formData.append("privacy", privacy);
      formData.append("createdBy", user._id);

      const response = await fetch(`${API_BASE_URL}/community/create`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setTitle("");
        setDescription("");
        setPreviewImage(null);
        setPreviewImage1(null);
        setLogo(null);
        setCoverPhoto(null);
        setCommunityCreatePanel(false);
      } else {
        toast.error(data.message);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const [communityPanel, setCommunityPanel] = useState(false);
  const [dispAllCommunities, setDispAllCommunities] = useState(false);

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="chat" />
      {isLoading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-30 z-50">
          <SyncLoader color="skyblue" loading={isLoading} size={15} />
        </div>
      )}
      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>

        <main className="flex-grow p-4 md:p-6 mb-20">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleChange}
              placeholder="Search users, companies, or communities..."
              className="flex-grow p-2 border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
            <i
              className="text-4xl ri-user-community-line"
              onClick={() => {
                setCommunityPanel(false);
                setDispAllCommunities(true);
              }}
            ></i>
          </div>
          {searchResults.length === 0 && reChats.length === 0 && (
            <p className="text-center font-bold text-2xl text-gray-500 mt-60">
              No results found.
            </p>
          )}
          {(reChats.length > 0 || searchResults.length > 0) && (
            <section className="mb-6">
              {reChats.length > 0 && searchResults.length == 0 && (
                <>
                  {/* Buttons RecentChats , Communities */}
                  <div className="flex gap-3">
                    <div
                      onClick={() => {
                        setCommunityPanel(false);
                        setDispAllCommunities(false);
                      }}
                      className="bg-blue-200 p-2 shadow-[2px_3px_0px_0px] text-sm border-2 border-black rounded-md md:text-base font-black mb-4"
                    >
                      Recent Chats
                    </div>
                    <div
                      onClick={() => {
                        setCommunityPanel(true);
                        setDispAllCommunities(false);
                      }}
                      className="bg-red-200 p-2 shadow-[2px_3px_0px_0px] text-sm border-2 border-black rounded-md md:text-base font-black mb-4"
                    >
                      Communities
                    </div>
                  </div>

                  {communityPanel ? (
                    <section>
                      <h2 className="font-bold mb-4">Joined Comunities</h2>
                      {allCommunity
                        .filter((myComm) =>
                          myComm.members.some(
                            (member) => member._id.toString() === user._id
                          )
                        )
                        .map((comm) => (
                          <article
                            key={comm._id}
                            className="bg-white border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 cursor-pointer flex items-center gap-4"
                            onClick={() =>
                              navigate(`/user/commChatPost/${comm._id}`)
                            }
                          >
                            <img
                              src={comm.logo}
                              alt={comm.name}
                              className="w-12 h-12 md:w-16 md:h-16 border-2 border-black rounded-full"
                            />
                            <div>
                              <h3 className="text-lg md:text-xl font-black mb-1">
                                {comm.name}
                              </h3>
                              <p className="text-sm font-bold">
                                Members :{" "}
                                {comm.members && comm.members.length - 1}
                              </p>
                            </div>
                          </article>
                        ))}
                    </section>
                  ) : (
                    // Recent chats
                    !dispAllCommunities && (
                      <section>
                        {reChats.length > 0 && (
                          <div className="flex flex-col gap-4">
                            {reChats.map((chat) => (
                              <article
                                onClick={() =>
                                  !longPressMessage &&
                                  navigate(
                                    `/user/userChat/${chat.otherParticipant._id}`
                                  )
                                }
                                onTouchStart={(e) => {
                                  const timer = setTimeout(
                                    () => handleLongPress(chat.conversationId),
                                    300
                                  );
                                  e.target.addEventListener(
                                    "touchend",
                                    () => clearTimeout(timer),
                                    {
                                      once: true,
                                    }
                                  );
                                }}
                                key={chat.otherParticipant._id}
                                className="bg-white border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 cursor-pointer flex items-center gap-4"
                              >
                                <img
                                  src={chat.otherParticipant.avatar}
                                  alt={chat.otherParticipant.name}
                                  className="w-12 h-12 md:w-16 md:h-16 border-2 border-black rounded-full"
                                />
                                <div>
                                  <h3 className="text-lg md:text-xl font-black mb-1">
                                    {chat.otherParticipant.name}
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-1 line-clamp-1">
                                    {chat.latestMessage &&
                                      chat.latestMessage.message}
                                  </p>
                                  <span className="text-gray-500 text-xs">
                                    {chat.latestMessage &&
                                      getLastSeenMessage(chat.createdAt)}
                                  </span>
                                </div>
                                {chat.isReadCount != 0 && (
                                  <div className="w-6 h-6 rounded-full bg-red-500 absolute right-20 flex items-center justify-center text-white font-bold">
                                    {chat.isReadCount}
                                  </div>
                                )}
                              </article>
                            ))}
                          </div>
                        )}
                      </section>
                    )
                  )}

                  {/* All Communites */}
                  {dispAllCommunities && (
                    <section>
                      {allCommunity.length > 0 && (
                        <div className="flex flex-col gap-4">
                          <h2 className="font-bold">All Comunities</h2>
                          {allCommunity.map((comm) => (
                            <article
                              key={comm._id}
                              className="bg-white border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 cursor-pointer flex items-center gap-4"
                              onClick={() =>
                                navigate(`/user/commChat/${comm._id}`)
                              }
                            >
                              <img
                                src={comm.logo}
                                alt={comm.name}
                                className="w-12 h-12 md:w-16 md:h-16 border-2 border-black rounded-full"
                              />
                              <div>
                                <h3 className="text-lg md:text-xl font-black mb-1">
                                  {comm.name}
                                </h3>
                                <p className="text-sm font-bold">
                                  Members :{" "}
                                  {comm.members && comm.members.length - 1}
                                </p>
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                </>
              )}

              {/* Search Results */}
              {searchResults.length === 0 && reChats.length === 0 ? (
                <p>No results found.</p>
              ) : (
                dispAllCommunities && (
                  <section>
                    {searchResults.length > 0 && (
                      <div className="flex flex-col gap-4">
                        {searchResults.map((chat) => (
                          <article
                            onClick={() =>
                              navigate(`/user/userChat/${chat._id}`)
                            }
                            key={chat._id}
                            className="bg-white border-2 rounded-lg  border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center gap-4"
                          >
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className="w-12 h-12 md:w-16 md:h-16 border-2 border-black rounded-full"
                            />
                            <div>
                              <h3 className="text-lg md:text-xl font-black mb-1">
                                {chat.name}
                              </h3>
                              <p className="text-gray-600 text-sm mb-1 line-clamp-1">
                                {chat.lastMessage.message}
                              </p>
                              <span className="text-gray-500 text-xs">
                                {chat.lastMessage.message
                                  ? getLastSeenMessage(
                                      chat.lastMessage.updatedAt
                                    )
                                  : ""}
                              </span>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>
                )
              )}
            </section>
          )}
        </main>
      </div>

      <div
        ref={OptionRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white py-10"
      >
        <div
          className="absolute top-4 right-10"
          onClick={() => setLongPressMessage(null)}
        >
          <i className="text-black font-bold text-xl ri-close-large-fill"></i>
        </div>
        <div
          onClick={handleDeleteConversation}
          className="font-bold text-center text-xl bg-gray-200 w-1/3 shadow-[2px_2px_0px_0px] mx-auto border-2 border-black"
        >
          Delete <i className="text-2xl ri-delete-bin-line ml-1"></i>
        </div>
      </div>

      <button
        onClick={handleCreateCommunity}
        className="fixed bottom-24 right-4 sm:bottom-4 bg-purple-500 text-white font-bold p-4 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
      >
        <i className="ri-add-line sm:text-2xl"></i>
      </button>

      {communityCreatePanel && (
        <div className="z-40  h-screen w-screen flex justify-center items-center fixed bg-opacity-70 bg-black">
          <button
            className="absolute top-5  right-4 cursor-pointer z-50"
            onClick={() => setCommunityCreatePanel(false)}
          >
            <i className="text-white font-bold text-2xl ri-close-large-fill"></i>
          </button>
          <div className="h-[90%] overflow-y-auto w-5/6 sm:w-1/3 p-5 rounded-md border-2 border-black shadow-[2px_2px_0px_0px] bg-white">
            <h2 className="font-extrabold text-xl">Create Community</h2>

            <form className="mt-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Community Name"
                  className="w-full p-2 border-black border-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] my-1"
                />
              </div>
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Community Details"
                  className="w-full p-2 h-40 border-black border-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] my-1"
                />
              </div>
              <span className="font-bold">Cover Photo :</span>

              <div className="relative">
                <div className="h-48 sm:w-full border-4 border-black overflow-hidden">
                  {coverPhoto ? (
                    <img
                      src={previewImage1 ? previewImage1 : coverPhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <i className="ri-user-3-line text-4xl text-gray-400"></i>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full border-2 border-black cursor-pointer hover:bg-blue-600 transition-colors">
                  <i className="ri-camera-line"></i>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="image"
                    onChange={handleCoverPhotoChange}
                  />
                </label>
              </div>

              <div className="mt-2 relative">
                <span className="font-bold">Logo :</span>
                <div className="h-32 w-32 border-4 border-black overflow-hidden">
                  {logo ? (
                    <img
                      src={previewImage ? previewImage : logo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <i className="ri-user-3-line text-4xl text-gray-400"></i>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 left-24 bg-blue-500 text-white p-1 rounded-full border-2 border-black cursor-pointer hover:bg-blue-600 transition-colors">
                  <i className="ri-camera-line text-sm"></i>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    name="image"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
              <div>
                <select
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full p-2 border-black border-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] my-1"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full p-2 border-black border-2 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] my-1 bg-purple-500 font-bold text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentChats;
