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
      
      {/* Autho Routes */}
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
        path="/user/profile"
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
      />{" "}
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
    </Routes>
  );
};

export default App;
