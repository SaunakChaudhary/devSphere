import SyncLoader from "react-spinners/SyncLoader";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../Context/SocketContext";
import { UserDataContext } from "../../Context/UserContext";
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

const CommChatPost = () => {
  const { id } = useParams();
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  const [commDetails, setCommDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/community/searchedCommunity/${id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setCommDetails(data.community);
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

  useEffect(() => {
    if (socket) {

      const handleNewMessage = async (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setScrollWhenMessageSend(true);
      };

      socket.on("sendCommMsg", handleNewMessage);

      return () => socket.off("sendCommMsg", handleNewMessage);
    }
  }, [API_BASE_URL, id, socket, user?._id]);


  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("JavaScript");
  const [scrollWhenMessageSend, setScrollWhenMessageSend] = useState(false);
  const [initalLoaded, setInitialLoaded] = useState(false);
  const [isCodeSnippetMode, setIsCodeSnippetMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSendMessage();
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/community/getMessagesOfCommunity/${id}`
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

  const handleSendMessage = async () => {
    const messageContent = isCodeSnippetMode ? codeSnippet : newMessage;
    if (!messageContent.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/community/sendMessageToAll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
          senderId: user._id,
          communityId: id,
          isCode: isCodeSnippetMode,
          language,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages([
          ...messages,
          {
            _id: data.post._id,
            communityId: data.post.communityId,
            isCode: data.post.isCode,
            language: data.post.language,
            createdBy: data.post.createdBy,
            createdAt: data.post.createdAt,
            content: data.post.content
          }])
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    setScrollWhenMessageSend(false);
    setInitialLoaded(false);
  }, [scrollWhenMessageSend, initalLoaded]);

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
                src={commDetails.logo}
                alt={commDetails.name}
                className="w-10 h-10 rounded-full shadow-lg"
              />
              <div>
                <p className="font-bold text-base">{commDetails.name}</p>
                <p className="font-semibold text-xs text-gray-500">
                  Members :{" "}
                  {commDetails.members &&
                    commDetails.members.length &&
                    commDetails.members.length - 1}
                </p>
              </div>
            </h2>

            <div
              ref={chatContainerRef}
              className={`flex-grow sm:border-2 border-black overflow-y-auto ${isCodeSnippetMode ? "mb-32" : "mb-20"}  p-4 w-full bg-[#fbfbfb] mt-20 sm:max-w-[1220px] sm:mb-40`}
            >
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex items-start mb-4 relative ${message.createdBy === user._id ? `justify-end` : ``
                    } `}
                >
                  <div
                    className={`p-3 sm:max-w-[1030px] rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black ${message.createdBy === user._id && `bg-blue-100`}`}
                    style={{
                      wordBreak: "break-word", 
                      overflowWrap: "break-word", 
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
                            {message.content}
                          </SyntaxHighlighter>
                        ) : (
                          <>
                            {isExpanded || message.content.length <= 1000 ? (
                              message.content
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

export default CommChatPost;
