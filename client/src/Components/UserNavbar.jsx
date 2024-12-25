
import { NavLink } from 'react-router-dom'

const UserNavbar = () => {
  return (
    <div>
      {/* Navbar */}
      <div className="p-4">
        <nav className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] py-4 px-6 border-4 border-black flex justify-between items-center">
          <h1 className="flex items-center text-2xl font-black text-black">
            <i className="mr-2 ri-terminal-window-line text-3xl"></i>
            <span>DevSphere</span>
          </h1>
          <div className="hidden md:flex gap-6">
            <NavLink
              to="/dashboard"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Home
            </NavLink>
            <NavLink
              to="/user/notification"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Notifications
            </NavLink>
            <NavLink
              to="/logout"
              className="text-black font-bold hover:underline hover:text-blue-700"
            >
              Logout
            </NavLink>
          </div>
          <div className="block sm:hidden ">
            <NavLink
              to="/user/achievements"
              className="text-black font-bold mr-3"
            >
              {/* <i className="ri-award-line text-2xl text-[#DAA520]"></i> */}
              <span className="text-2xl">🏆</span>
            </NavLink>
            <NavLink to="/user/notification" className="text-black font-bold">
              <i className="mr-3 ri-notification-badge-line text-2xl active:text-red-500"></i>
            </NavLink>
            <NavLink to="/logout" className="text-black font-bold">
              <i className="ri-logout-box-r-line text-2xl active:text-red-500"></i>
            </NavLink>
          </div>
        </nav>
      </div>

      {/* For Mobile View Slidebar */}
      <div className="fixed bottom-0 w-full bg-white h-20 flex sm:hidden justify-evenly items-center">
        <div className="p-3">
          <NavLink to="/dashboard">
            <i className="ri-home-4-line text-3xl"></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/search">
            <i className="ri-search-line text-3xl"></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/create-post">
            <i className="ri-add-box-line text-3xl"></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/challenges">
            <i className="ri-trophy-line text-3xl"></i>
          </NavLink>
        </div>{" "}
        <div className="p-3">
          <NavLink to="/user/profile">
            <i className="ri-user-3-line text-3xl"></i>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default UserNavbar
