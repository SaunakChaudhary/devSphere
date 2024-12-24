import { useState, useContext } from "react";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import { UserDataContext } from "../../Context/UserContext";

const UserProfile = () => {
  const { user } = useContext(UserDataContext);
  const [profileData, setProfileData] = useState({
    name: "John Developer",
    email: "john@developer.com",
    bio: "Full-stack developer passionate about creating meaningful applications",
    github: "github.com/johndev",
    linkedin: "linkedin.com/in/johndev",
    portfolio: "johndev.com",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  return (
    <div className="bg-yellow-50 min-h-screen">
      <UserNavbar />

      <div className="flex flex-col md:flex-row p-4">
        <UserSlidebar />

        <div className="flex-1 p-4 md:p-6 pb-24 sm:pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 md:p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                {/* Profile Picture Section */}
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-black overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
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
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-black mb-2">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 text-lg mb-4">
                    {user.email}
                  </p>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-black text-white font-bold py-2 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
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
                    value={user.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
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
                      value={user.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
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
                      value={user.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
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
                        value={user.github}
                        onChange={handleInputChange}
                        disabled={!isEditing}
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
                        value={user.linkedin}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-lg font-bold mb-2">
                        <i className="ri-global-line mr-2"></i>Portfolio Website
                      </label>
                      <input
                        type="text"
                        name="portfolio"
                        value={profileData.portfolio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 md:p-4 text-base md:text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
