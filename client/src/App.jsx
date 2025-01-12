import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/User/Dashboard";
import GettingInterest from "./Pages/User/GettingInterest";
import AboutPage from "./Pages/About";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserProtected from "./ProtectedRoute/UserProtected";
import Logout from "./Pages/Logout";
import Registration from "./Pages/Organization/Registration";
import CreatePost from "./Pages/User/CreatePost";
import Profile from "./Pages/User/Profile";
import Challenges from "./Pages/User/Challenges";
import Achivements from "./Pages/User/Achivements";
import Search from "./Pages/User/Search";
import PNF from "./Pages/PNF";
import UserProfile from "./Pages/User/UserProfile";
import DispFollowUsers from "./Pages/User/DispFollowUsers";
import MyProfile from "./Pages/User/MyProfile";
import Notifications from "./Pages/User/Notification";
import Redirect from "./Pages/User/Redirect";
import ProjectsHashtag from "./Pages/User/ProjectsHashtag";
import ChatPage from "./Pages/User/ChatPage";
import RecentChats from "./Pages/User/RecentChats";
import UserSettings from "./Pages/User/UserSettings";
import CommChat from "./Pages/User/CommChat";
import CommChatPost from "./Pages/User/CommChatPost";

const App = () => {
  return (
    <Routes>
      {/* Normal Routes */}

      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/login"
        element={
          <GoogleOAuthProvider clientId="856081260910-rd7path9ft7f9l83qs9ecpuskj36cj6p.apps.googleusercontent.com">
            <Login />
          </GoogleOAuthProvider>
        }
      />
      <Route
        path="/signup"
        element={
          <GoogleOAuthProvider clientId="856081260910-rd7path9ft7f9l83qs9ecpuskj36cj6p.apps.googleusercontent.com">
            <Signup />
          </GoogleOAuthProvider>
        }
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="/*" element={<PNF />} />


      {/* Auth Routes */}
      <Route
        path="/organization-signup"
        element={
          <UserProtected>
            <Registration />
          </UserProtected>
        }
      />
      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <UserProtected>
            <Dashboard />
          </UserProtected>
        }
      />
      <Route
        path="/interest"
        element={
          <UserProtected>
            <GettingInterest />
          </UserProtected>
        }
      />
      <Route
        path="/user/create-post"
        element={
          <UserProtected>
            <CreatePost />
          </UserProtected>
        }
      />
      <Route
        path="/user/edit-profile"
        element={
          <UserProtected>
            <Profile />
          </UserProtected>
        }
      />
      <Route
        path="/user/challenges"
        element={
          <UserProtected>
            <Challenges />
          </UserProtected>
        }
      />
      <Route
        path="/user/achievements"
        element={
          <UserProtected>
            <Achivements />
          </UserProtected>
        }
      />
      <Route
        path="/user/search"
        element={
          <UserProtected>
            <Search />
          </UserProtected>
        }
      />
      <Route
        path="/user/dispfollowList"
        element={
          <UserProtected>
            <DispFollowUsers />
          </UserProtected>
        }
      />
      <Route
        path="/user/user_profile/:id"
        element={
          <UserProtected>
            <UserProfile />
          </UserProtected>
        }
      />
      <Route
        path="/user/profile"
        element={
          <UserProtected>
            <MyProfile />
          </UserProtected>
        }
      />
      <Route
        path="/user/notification"
        element={
          <UserProtected>
            <Notifications />
          </UserProtected>
        }
      />
      <Route
        path="/user/projects/:id"
        element={
          <UserProtected>
            <ProjectsHashtag />
          </UserProtected>
        }
      />
      <Route
        path="/user/chat"
        element={
          <UserProtected>
            <RecentChats />
          </UserProtected>
        }
      />
      <Route
        path="/user/userChat/:id"
        element={
          <UserProtected>
            <ChatPage />
          </UserProtected>
        }
      />
      <Route
        path="/user/commChat/:id"
        element={
          <UserProtected>
            <CommChat />
          </UserProtected>
        }
      />
      <Route
        path="/user/commChatPost/:id"
        element={
          <UserProtected>
            <CommChatPost />
          </UserProtected>
        }
      />
      <Route
        path="/user/settings"
        element={
          <UserProtected>
            <UserSettings />
          </UserProtected>
        }
      />
      <Route path="/user/:id" element={<Redirect />} />{" "}
    </Routes>
  );
};

export default App;
