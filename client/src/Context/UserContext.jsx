/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    avatar: "",
    interest: [],
  });

  const [globalHashtags, setGlobalHashtags] = useState([]);
  const [reChats, setReChats] = useState([]);

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        setGlobalHashtags,
        globalHashtags,
        setReChats,
        reChats,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
