import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserContext from "./Context/UserContext.jsx";
import SocketContext from "./Context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <SocketContext>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </SocketContext>
    </UserContext>
  </StrictMode>
);
