import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserDataContext } from "../Context/UserContext";


const UserSlidebar = () => {
  const {user} = useContext(UserDataContext);
  return (
    <aside className="hidden sm:block bg-white w-full h-screen md:w-64 p-6 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      {/* User Info */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <p
          className={`mt-4 text-lg font-bold text-black text-center ${user.name.length > 20 ? "text-sm" : ""}`}
          title={user.name}
        >
          {user.name}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
        <NavLink
          to="/user/profile"
          className="flex items-center gap-2 text-lg font-medium text-black hover:bg-blue-100 active:translate-x-1 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <i className="ri-user-line"></i> My Profile
        </NavLink>
        <NavLink
          to="/user/create-post"
          className="flex items-center gap-2 text-lg font-medium text-black hover:bg-blue-100 active:translate-x-1 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <i className="ri-pencil-line"></i> Upload Projects
        </NavLink>
        <NavLink
          to="/user/search"
          className="flex items-center gap-2 text-lg font-medium text-black hover:bg-blue-100 active:translate-x-1 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <i className="ri-search-line"></i> Search
        </NavLink>
        <NavLink
          to="/user/challenges"
          className="flex items-center gap-2 text-lg font-medium text-black hover:bg-blue-100 active:translate-x-1 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <i className="ri-trophy-line"></i> Challenges
        </NavLink>
        <NavLink
          to="/user/achievements"
          className="flex items-center gap-2 text-lg font-medium text-black hover:bg-blue-100 active:translate-x-1 p-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <i className="ri-award-line"></i> Badges & Achievements
        </NavLink>
      </nav>
    </aside>
  );
};

export default UserSlidebar;
