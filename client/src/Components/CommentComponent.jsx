/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { UserDataContext } from "../Context/UserContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ projectId }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserDataContext);

  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/comment/fecth-comment/${projectId}`
        );
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch comments");
      }
    };

    fetchComments();
  }, [API_BASE_URL, projectId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comment/create-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: projectId,
          userId: user._id,
          content: comment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data]);
        setComment("");
        toast.success("Comment added successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/comment/delete-comment/${commentId}/${projectId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success("Comment deleted successfully");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const [dispUpd, setDispUpd] = useState([]);
  const updateComment = async (commentId, index) => {
    setDispUpd((prevDispProject) => {
      const newEdit = [...prevDispProject];
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

  const [updComment, setUpdComment] = useState("");

  const handleUpdateComment = async (e,commentId,index) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}/comment/update-comment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: updComment,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(
          comments.map((c) =>
            c._id === data._id ? { ...c, content: data.content } : c
          )
        );
        toast.success("Comment updated successfully");
        setDispUpd((prevDispProject) => {
          const newEdit = [...prevDispProject];
          const ch = newEdit[index];
          newEdit.fill(false);
          if (newEdit[index] === undefined) {
            newEdit[index] = true;
          } else {
            newEdit[index] = !ch;
          }
          return newEdit;
        });
    
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update comment " + error);
    }
  };

  return (
    <div className="bg-white p-2 sm:p-4 rounded-lg max-w-full">
      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Comments</h3>

      <form onSubmit={handleSubmitComment} className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-start gap-2 w-full">
            <img
              src={user.avatar}
              alt="User"
              className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-black rounded-full flex-shrink-0"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 min-h-[60px] sm:min-h-[40px] border-2 border-black p-2 resize-y"
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-300 text-black font-bold px-4 py-2 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-3 sm:space-y-4 max-h-[400px] overflow-y-auto">
        {comments.map((comment, index) => (
          <div
            key={comment._id}
            className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 border-2 border-black rounded"
          >
            <img
              src={comment.userId.avatar}
              alt={comment.userId.name}
              className="w-8 h-8 border-2 border-black rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between cursor-pointer items-start flex-wrap gap-2">
                <div
                  className="min-w-0"
                  onClick={() =>
                    navigate(`/user/user_profile/${comment.userId._id}`)
                  }
                >
                  <h4 className="font-bold text-sm sm:text-base truncate">
                    {comment.userId.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    @{comment.userId.username}
                  </p>
                </div>
                {user._id === comment.userId._id && (
                  <div>
                    <button
                      onClick={() => updateComment(comment._id, index)}
                      className="text-yellow-500 hover:text-yellow-600 p-1"
                    >
                      <i className="ri-edit-2-line text-lg"></i>
                    </button>

                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm sm:text-base break-words">
                {!dispUpd[index] ? (
                  comment.content
                ) : (
                  <form
                    className="flex flex-wrap gap-3 w-full"
                    onSubmit={(e)=>handleUpdateComment(e,comment._id,index)}
                  >
                    <input
                      type="text"
                      name="cmt"
                      className="flex-1 border-2 p-2 border-black bg-white w-full sm:w-auto"
                      value={updComment || comment.content}
                      onChange={(e) => setUpdComment(e.target.value)}
                      placeholder="Enter your comment"
                    />
                    <button className="text-sm shadow-[2px_2px_0px_0px] border-2 border-black p-2 bg-blue-300 font-bold w-full sm:w-auto">
                      Update
                    </button>
                  </form>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
