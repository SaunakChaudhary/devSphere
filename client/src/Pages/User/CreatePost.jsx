import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";

const CreatePost = () => {
  const navigate = useNavigate();
  const [hashtags, setHashtags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddHashtag = () => {
    if (currentTag && !hashtags.includes(currentTag)) {
      setHashtags([...hashtags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      <UserNavbar />
      
      <div className="p-4 flex flex-col md:flex-row">
        <UserSlidebar />
        
        {/* Main Content Area with Responsive Padding */}
        <div className="flex-1 p-4 md:p-6 pb-24 sm:pb-6"> {/* Added bottom padding for mobile */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8">
              {/* Header */}
              <h1 className="text-3xl md:text-4xl font-black mb-6 md:mb-8 flex items-center">
                <i className="ri-quill-pen-line mr-4 text-2xl md:text-3xl"></i>
                Create New Post
              </h1>

              {/* Title Input */}
              <div className="mb-4 md:mb-6">
                <label className="block text-lg md:text-xl font-bold mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="Give your post a catchy title"
                />
              </div>

              {/* Description */}
              <div className="mb-4 md:mb-6">
                <label className="block text-lg md:text-xl font-bold mb-2">Description</label>
                <textarea
                  className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[150px] md:min-h-[200px]"
                  placeholder="Write about your project..."
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4 md:mb-6">
                <label className="block text-lg md:text-xl font-bold mb-2">Project Images</label>
                <div className="border-4 border-black p-4 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-blue-50">
                  <div className="border-4 border-dashed border-black p-4 md:p-8 text-center">
                    <i className="ri-image-add-line text-3xl md:text-4xl mb-2"></i>
                    <p className="text-base md:text-lg font-bold">Drag and drop images here</p>
                    <p className="text-sm mb-4">or</p>
                    <button className="bg-blue-500 text-white font-bold py-2 px-4 md:px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-600 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>

              {/* Hashtags */}
              <div className="mb-6 md:mb-8">
                <label className="block text-lg md:text-xl font-bold mb-2">
                  Hashtags <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-black text-white px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-bold flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveHashtag(tag)}
                        className="hover:text-red-400"
                      >
                        <i className="ri-close-line"></i>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="flex-grow p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="Add hashtags (e.g. javascript, webdev)"
                  />
                  <button
                    onClick={handleAddHashtag}
                    className="bg-black text-white font-bold py-3 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full sm:w-auto bg-white text-black font-bold py-3 px-6 md:px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                >
                  Cancel
                </button>
                <button className="w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-6 md:px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;