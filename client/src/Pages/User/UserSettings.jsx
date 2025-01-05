import { useNavigate } from "react-router-dom";
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";

const UserSettings = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="home" />

      <div className="p-4 flex-grow flex flex-col md:flex-row">
        <div>
          <UserSlidebar />
        </div>
        <div className="text-center text-2xl text-gray-500 font-bold mx-auto my-20">
          Comming Soon ...
        </div>
        <div className="sm:hidden">
          <button
            onClick={()=>navigate("/logout")}
            className="mb-20 w-full text-red-800 p-2 text-xl bg-red-300 font-bold border-2 border-black"
          >
            Logout <i className="ri-logout-box-r-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
