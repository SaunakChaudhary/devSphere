import { useState, useContext, useEffect } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { UserDataContext } from "../../Context/UserContext";
import { toast } from "react-hot-toast";
import SyncLoader from "react-spinners/SyncLoader";

const UserProfile = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const { user, setUser } = useContext(UserDataContext);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    portfolioWebsite: user?.portfolioWebsite || "",
    mobileNo: user?.mobileNo || "",
  });

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfileData({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      portfolioWebsite: user?.portfolioWebsite || "",
      mobileNo: user?.mobileNo || "",
    });
  }, [user]);

  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profileData.username === "") {
        toast.error("Username is required");
        return;
      }

      if(profileData.mobileNo.length !== 10){
        toast.error("Mobile no should be of 10 digits");
        return;
      }
      setIsLoading(true);
      // Update user profile
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("username", profileData.username);
      formData.append("email", profileData.email);
      formData.append("bio", profileData.bio);
      formData.append("avatar", image);
      formData.append("github", profileData.github);
      formData.append("linkedin", profileData.linkedin);
      formData.append("portfolioWebsite", profileData.portfolioWebsite);
      formData.append("mobileNo", profileData.mobileNo);

      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen">
      {isLoading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-30 z-50">
          <SyncLoader color="skyblue" loading={isLoading} size={15} />
        </div>
      )}
      <UserNavbar />

      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />

        <div className="flex-1 p-4 md:p-6 pb-24 sm:pb-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  {/* Profile Picture Section */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-black overflow-hidden">
                      {profileData.avatar ? (
                        <img
                          src={previewImage ? previewImage : profileData.avatar}
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
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black mb-2">
                      {user.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-4">{user.email}</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg md:text-xl font-bold mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all min-h-[100px] disabled:bg-gray-50"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-lg md:text-xl font-bold mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-lg md:text-xl font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-lg md:text-xl font-bold mb-2">
                        Mobile no
                      </label>
                      <input
                        type="text"
                        name="mobileNo"
                        value={profileData.mobileNo}
                        onChange={handleInputChange}
                        className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-lg md:text-xl font-bold mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={profileData.username}
                        onChange={handleInputChange}
                        className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Social Links</h2>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-lg font-bold mb-2">
                          <i className="ri-github-fill mr-2"></i>GitHub
                        </label>
                        <input
                          type="text"
                          name="github"
                          value={profileData.github}
                          onChange={handleInputChange}
                          className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold mb-2">
                          <i className="ri-linkedin-box-fill mr-2"></i>LinkedIn
                        </label>
                        <input
                          type="text"
                          name="linkedin"
                          value={profileData.linkedin}
                          onChange={handleInputChange}
                          className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-lg font-bold mb-2">
                          <i className="ri-global-line mr-2"></i>Portfolio
                          Website
                        </label>
                        <input
                          type="text"
                          name="portfolio"
                          value={profileData.portfolioWebsite}
                          onChange={handleInputChange}
                          className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-black text-white font-bold py-2 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
