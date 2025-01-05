import { useParams } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../../Context/UserContext";
import { SocketContext } from "../../Context/SocketContext";
import { useContext, useEffect, useRef, useState } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import SyncLoader from "react-spinners/SyncLoader";
import toast from "react-hot-toast";

const UserChatPage = () => {
  const [scrollWhenMessageSend, setScrollWhenMessageSend] = useState(false);
  const [initalLoaded, setInitialLoaded] = useState(false);

  const { id } = useParams();
  const { user } = useContext(UserDataContext);
  const { socket, onlineUsers } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [userDetails, setuserDetails] = useState([]);
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
      const handleNewMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setScrollWhenMessageSend(true);
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
  }, [messages, socket]);

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/message/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          senderId: user._id,
          receiverId: id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (newMessage.trim()) {
          setMessages([
            ...messages,
            {
              _id: data.newMessage._id,
              senderId: user._id,
              receiverId: id,
              message: newMessage,
              createdAt: new Date(),
            },
          ]);
          setNewMessage("");
          setScrollWhenMessageSend(true);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
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
            <h2 className="z-50 sm:border-2 flex sm:max-w-[1220px] items-center p-6 w-full gap-6 text-3xl border-black border-b font-black text-black mb-6 fixed sm:absolute bg-[#fef7cc]">
              <img
                src={userDetails.avatar}
                alt={userDetails.name}
                className="w-10 h-10 rounded-full shadow-lg"
              />
              <div>
                <p className="font-bold text-sm">{userDetails.name}</p>
                <div className="font-semibold flex items-center text-xs text-[#727272]">
                  {onlineUsers && onlineUsers.includes(userDetails._id) ? (
                  <span className="p-1 rounded-full bg-green-600 mr-2"></span>
                  ) : (
                    <i className="ri-time-line text-xs mr-2" />
                  )}
                  {onlineUsers && onlineUsers.includes(userDetails._id)
                    ? "Online"
                    : `Last seen 11:02 PM`} 
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
              className="flex-grow sm:border-2 border-black overflow-y-auto mb-20 p-4 w-full bg-[#fbfbfb] mt-20 sm:max-w-[1220px] sm:mb-40"
              onClick={() => setLongPressMessage(null)}
            >
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex items-start mb-4 relative ${
                    message.senderId === user._id
                      ? `justify-end  ${
                          longPressMessage === message._id && "bg-green-200"
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
                    className={`p-3 max-w-48 sm:max-w-96 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black ${
                      message.senderId === user._id
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
                    <p className="font-bold text-xs mb-1">
                      {message.senderId === user._id ? "You" : userDetails.name}{" "}
                      <span className="text-gray-500 font-normal text-[10px]">
                        {new Date(message.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </p>
                    <p className="text-xs">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Enter Text */}
            <div className="flex p-4 sm:border-2 border-black gap-4 bg-[#f7f7f7] fixed sm:absolute sm:max-w-[1220px] bottom-0 sm:bottom-[100px] w-full">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow border-2 border-black p-3 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="rounded-2xl bg-blue-500 text-white font-bold px-6 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600"
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserChatPage;
