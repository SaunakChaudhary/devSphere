import { useParams } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../../Context/UserContext";
import { SocketContext } from "../../Context/SocketContext";
import { useContext, useEffect, useRef, useState } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import SyncLoader from "react-spinners/SyncLoader";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokaiSublime } from "react-syntax-highlighter/dist/esm/styles/hljs";


const UserChatPage = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("JavaScript");
  const [scrollWhenMessageSend, setScrollWhenMessageSend] = useState(false);
  const [initalLoaded, setInitialLoaded] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  const { id } = useParams();
  const { user } = useContext(UserDataContext);
  const { socket, onlineUsers } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [userDetails, setuserDetails] = useState([]);
  const [isCodeSnippetMode, setIsCodeSnippetMode] = useState(false); // Toggle between text and code snippet mode
  const [codeSnippet, setCodeSnippet] = useState("");

  const getLastSeenMessage = (lastSeen) => {
    const lastSeenDate = dayjs(lastSeen);

    if (lastSeenDate.isToday()) {
      return `Last seen today at ${lastSeenDate.format("h:mm A")}`;
    } else if (lastSeenDate.isYesterday()) {
      return `Last seen yesterday at ${lastSeenDate.format("h:mm A")}`;
    } else {
      return `Last seen on ${lastSeenDate.format(
        "MMM DD, YYYY"
      )} at ${lastSeenDate.format("h:mm A")}`;
    }
  };

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/search/searchedUser/${id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setuserDetails(data.userData);
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [API_BASE_URL, id]);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (socket) {
      const handleNewMessage = async (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setScrollWhenMessageSend(true);
        const response = await fetch(
          `${API_BASE_URL}/message/isRead/${user?._id}/${id}`,
          {
            method: "PUT",
          }
        );
        const data = await response.json();
        if (!response.ok) toast.error(data.message);
      };

      const deleteMessage = (longPressMessage) => {
        const msgs = messages.filter((msg) => longPressMessage != msg._id);
        setMessages(msgs);
      };

      const clearChat = () => {
        setMessages([]);
      };

      socket.on("sendMsg", handleNewMessage);
      socket.on("dltMsg", deleteMessage);
      socket.on("clrMsg", clearChat);

      return () => socket.off("sendMsg", handleNewMessage);
    }
  }, [API_BASE_URL, id, messages, socket, user?._id]);

  const handleSendMessage = async () => {
    const messageContent = isCodeSnippetMode ? codeSnippet : newMessage;
    if (!messageContent.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/message/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          senderId: user._id,
          receiverId: id,
          isCode: isCodeSnippetMode,
          language,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages([
          ...messages,
          {
            _id: data.newMessage._id,
            senderId: user._id,
            receiverId: id,
            message: messageContent,
            isCode: isCodeSnippetMode,
            language,
            createdAt: new Date(),
          },
        ]);
        setNewMessage("");
        setCodeSnippet("");
        setScrollWhenMessageSend(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to send the message. Please try again. " + error);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSendMessage();
    }
  };
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    setScrollWhenMessageSend(false);
    setInitialLoaded(false);
  }, [scrollWhenMessageSend, initalLoaded]);

  const [longPressMessage, setLongPressMessage] = useState(null);

  const handleLongPress = (messageId) => {
    setLongPressMessage(messageId);
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/message/getMessage/${user?._id}/${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setMessages(data.messages);
          setInitialLoaded(true);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch messages. Please try again.");
        console.error("Error fetching messages:", error);
      }
    };
    if (user._id && id) getMessages();
  }, [API_BASE_URL, id, user._id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/message/DeleteMessage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: longPressMessage,
          receiverId: id,
          senderId: user._id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const msgs = messages.filter((msg) => longPressMessage != msg._id);
        setMessages(msgs);
        setLongPressMessage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleClear = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/message/clear-msg`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderId: user._id, receiverId: id }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setMessages([]);
        setMoreOption(false);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const [moreOPtion, setMoreOption] = useState(false);

  return (
    <div className="bg-yellow-50 flex flex-col">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      {isOpen && (
        <div className="flex flex-col gap-4 text-white font-semibold text-2xl bg-black bg-opacity-70 fixed w-screen h-screen z-50">
          <button
            className="absolute top-5 right-4 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <i className="text-white font-bold text-2xl ri-close-large-fill"></i>
          </button>
          <div className="text-center mt-32 mb-10">Select The Language</div>

          {[
            { name: "JavaScript", value: "JavaScript", icon: "https://img.icons8.com/?size=100&id=108784&format=png&color=000000" },
            { name: "HTML", value: "HTML", icon: "https://img.icons8.com/?size=100&id=20909&format=png&color=000000" },
            { name: "CSS", value: "CSS", icon: "https://img.icons8.com/?size=100&id=7gdY5qNXaKC0&format=png&color=000000" },
            { name: "Python", value: "python", icon: "https://img.icons8.com/?size=100&id=13441&format=png&color=000000" },
            { name: "Java", value: "java", icon: "https://img.icons8.com/?size=100&id=Pd2x9GWu9ovX&format=png&color=000000" },
          ].map((language, index) => (
            <div key={language.value}>
              <button
                className="flex mx-auto items-center active:text-red-500"
                onClick={() => {
                  setLanguage(language.value);
                    setIsOpen(false);
                }}
              >
                <img src={language.icon} className="w-10 h-10 mr-2" alt={language.name} />
                {language.name}
              </button>
              {index < 4 && <hr className="w-[80%] mx-auto" />}
            </div>
          ))}
        </div>
      )}

      <div className="hidden sm:block">
        <UserNavbar noti="noti" />
      </div>
      <div className="flex-grow flex flex-col md:flex-row sm:px-4 ">
        <div className="hidden sm:block mb-4 md:mb-0 ">
          <UserSlidebar />
        </div>

        <main className="flex-grow sm:max-w-7xl bg-yellow-50">
          <section className="bg-yellow-50 flex flex-col flex-grow sm:px-3 h-screen sm:fixed sm:w-full">
            {/* Header */}
            <h2 className="z-40 sm:border-2 flex sm:max-w-[1220px] items-center p-6 w-full gap-6 text-3xl border-black border-b font-black text-black mb-6 fixed sm:absolute bg-[#fef7cc]">
              <img
                src={userDetails.avatar}
                alt={userDetails.name}
                className="w-10 h-10 rounded-full shadow-lg"
              />
              <div>
                <p className="font-bold text-sm">{userDetails.name}</p>
                <div className="font-semibold flex items-center text-xs text-[#727272]">
                  {onlineUsers && onlineUsers.includes(userDetails._id) && (
                    <span className="p-1 rounded-full bg-green-600 mr-2"></span>
                  )}
                  {onlineUsers && onlineUsers.includes(userDetails._id)
                    ? "Online"
                    : getLastSeenMessage(userDetails.lastseen) !== Date.now() &&
                    getLastSeenMessage(userDetails.updatedAt)}
                </div>
              </div>
              {longPressMessage ? (
                <div className="absolute right-6" onClick={handleDelete}>
                  <i className="ri-delete-bin-line text-red-500 text-2xl"></i>
                </div>
              ) : (
                <div
                  className="absolute right-6"
                  onClick={() => setMoreOption(!moreOPtion)}
                >
                  <i className="ri-more-2-line text-2xl"></i>
                </div>
              )}
              {moreOPtion && (
                <div className="bg-white w-24 absolute top-[59px] border border-black right-9">
                  <div
                    className="font-semibold text-base text-center"
                    onClick={handleClear}
                  >
                    Clear Chat
                  </div>
                </div>
              )}
            </h2>

            {/* chat section */}
            <div
              ref={chatContainerRef}
              className={`flex-grow sm:border-2 border-black overflow-y-auto ${isCodeSnippetMode ? "mb-32" : "mb-20"}  p-4 w-full bg-[#fbfbfb] mt-20 sm:max-w-[1220px] sm:mb-40`}
              onClick={() => setLongPressMessage(null)}
            >
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex items-start mb-4 relative ${message.senderId === user._id
                    ? `justify-end  ${longPressMessage === message._id && "bg-green-200"
                    }`
                    : longPressMessage === message._id && "bg-green-200"
                    } `}
                  onTouchStart={(e) => {
                    const timer = setTimeout(
                      () => handleLongPress(message._id),
                      500
                    );
                    e.target.addEventListener(
                      "touchend",
                      () => clearTimeout(timer),
                      {
                        once: true,
                      }
                    );
                  }}
                >
                  <div
                    className={`p-3 sm:max-w-[1030px] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black ${message.senderId === user._id
                      ? longPressMessage === message._id
                        ? "bg-green-200"
                        : "bg-blue-100"
                      : longPressMessage === message._id
                        ? "bg-green-200"
                        : "bg-white"
                      }`}
                    style={{
                      wordBreak: "break-word", // Ensures long words break to the next line
                      overflowWrap: "break-word", // Provides additional support for wrapping
                    }}
                  >
                    <div className="text-base">
                      <div>
                        {message.isCode ? (
                          <SyntaxHighlighter
                            language={message.language}
                            style={monokaiSublime}
                            className="w-[350px] sm:w-[1000px] rounded-md p-2 text-xs"
                          >
                            {message.message}
                          </SyntaxHighlighter>
                        ) : (
                          <>
                            {isExpanded || message.message.length <= 1000 ? (
                              message.message
                            ) : (
                              <>
                                {message.message.substring(0, 1000)}...
                                <span
                                  className="text-blue-500 cursor-pointer"
                                  onClick={toggleReadMore}
                                >
                                  {' '}
                                  Read More
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-500 font-normal text-right pt-1 text-[10px] ml-8">
                      {new Date(message.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enter Text */}
            <div className="flex p-4 sm:border-2 border-black gap-4 bg-[#f7f7f7] fixed sm:absolute sm:max-w-[1220px] bottom-0 sm:bottom-[100px] w-full">
              <div className="flex flex-col gap-2 justify-center">
                {/* Language Selector */}
                {isCodeSnippetMode && <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-10 h-10 flex justify-center items-center"
                >
                  {language == "JavaScript" && <img src='https://img.icons8.com/?size=100&id=108784&format=png&color=000000' alt="JavaScript" className="w-10 h-10" />}
                  {language == "HTML" && <img src='https://img.icons8.com/?size=100&id=20909&format=png&color=000000' alt="HTML" className="w-10 h-10" />}
                  {language == "CSS" && <img src='https://img.icons8.com/?size=100&id=7gdY5qNXaKC0&format=png&color=000000' alt="CSS" className="w-10 h-10" />}
                  {language == "python" && <img src='https://img.icons8.com/?size=100&id=13441&format=png&color=000000' alt="Pyhton" className="w-10 h-10" />}
                  {language == "java" && <img src='https://img.icons8.com/?size=100&id=Pd2x9GWu9ovX&format=png&color=000000' alt="Java" className="w-10 h-10" />}
                </button>}

                <button
                  onClick={() => setIsCodeSnippetMode((prev) => !prev)}
                  className="rounded-2xl bg-gray-300 text-black font-bold w-10 h-10 border-2 border-black shadow hover:bg-gray-400"
                >
                  {isCodeSnippetMode ? (
                    <i className="ri-text font-bold"></i>
                  ) : (
                    <i className="ri-code-s-slash-line font-bold"></i>
                  )}
                </button>
              </div>

              {/* Input for text or code snippet */}
              {isCodeSnippetMode ? (
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your code here..."
                  className="flex-grow border-2 border-black p-3 rounded-lg shadow focus:outline-none"
                  rows="4"
                />
              ) : (
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-grow border-2 border-black p-3 rounded-lg shadow focus:outline-none"
                />
              )}
              <div className="flex items-center">
                <button
                  onClick={handleSendMessage}
                  disabled={
                    loading || (!isCodeSnippetMode && newMessage.trim() === "")
                  }
                  className="rounded-2xl bg-blue-500 text-white font-bold px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600"
                >
                  <i className="ri-send-plane-fill"></i>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserChatPage;
