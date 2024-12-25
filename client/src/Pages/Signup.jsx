import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import SyncLoader from "react-spinners/SyncLoader";
import { UserDataContext } from "../Context/UserContext";
import OTPValidation from "./OTP";

const AuthForm = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "https://devsphere-backend-bxxx.onrender.com";

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPPanel, setShowOTPPanel] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [pswErr, setPswErr] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gitHuburl: "",
    linkedInUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const sendEmail = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.length < 8) {
        toast.error("Password must be 8 characters long");
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setPswErr(true);
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/send-otp-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setServerOtp(data.OTP);
        setShowOTPPanel(true);
        setPswErr(false)
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error while creating account" + error);
    }
  };

  // Google Signup
  const responseGoogle = async (authResult) => {
    try {
      if (authResult["code"]) {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/auth/google-signup?code=${authResult.code}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          toast.success(data.message);
          localStorage.setItem("token", data.token);
          setUser(data.user);
          navigate("/interest");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Error while requesting google code" + error);
      console.log("Error while requesting google code" + error);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 flex items-center justify-center">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      {!showOTPPanel ? (
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-black mb-2">
                Join DevSphere
              </h1>
              <p className="font-bold text-gray-700">
                Create an account to contribute{" "}
                <span className="text-blue-600">&</span> Learn something new
              </p>
            </div>

            {/* Form */}
            <form onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="font-bold mb-1 block">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                    placeholder="John Doe"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                  <i className="ri-user-3-line absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 bg-[#ffffff] px-2"></i>
                </div>
              </div>

              <div>
                <label className="font-bold mb-1 block">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                  <i className="ri-mail-line absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 bg-[#ffffff] px-2"></i>
                </div>
              </div>

              <div>
                <label className="font-bold mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                    placeholder="••••••••"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <i className="ri-eye-line bg-[#ffffff] pl-2"></i>
                    ) : (
                      <i className="ri-eye-off-line bg-[#ffffff] pl-2 "></i>
                    )}
                  </button>
                </div>
                {pswErr && <span className="text-xs font-bold text-red-500">
                  <ul className="ml-2">
                    <li>
                      Password must contain at least 8 characters, one uppercase
                      letter, one lowercase letter, one number, and one special
                      character. (@  $  !  %  *  ? &)
                    </li>
                  </ul>
                </span>}
              </div>
              <div>
                <label className="font-bold mb-1 block">
                  GitHub Profile (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="github"
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                    placeholder="https://github.com/username"
                    onChange={handleChange}
                    value={formData.gitHuburl}
                  />
                  <i className="ri-github-line absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 bg-[#ffffff] px-2"></i>
                </div>
              </div>

              <div>
                <label className="font-bold mb-1 block">
                  LinkedIn Profile (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="linkedin"
                    className="w-full p-3 border-4 border-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400"
                    onChange={handleChange}
                    value={formData.linkedInUrl}
                    placeholder="https://linkedin.com/in/username"
                  />
                  <i className="ri-linkedin-fill absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 bg-[#ffffff] px-2"></i>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-300 text-black p-3 border-4 border-black font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all mt-6"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-2 border-black"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 font-bold">OR</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-4">
              <button
                onClick={googleSignup}
                className="w-full bg-gray-100 text-black p-3 border-4 border-black font-bold hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <i className="ri-google-fill"></i>
                Create Account using Google
              </button>
            </div>

            {/* Toggle Form Link */}
            <p className="text-center mt-6 font-bold">
              Already have an account ?
              <NavLink
                to="/login"
                className="text-blue-600 hover:underline ml-2"
              >
                Log in
              </NavLink>
            </p>
          </div>
        </div>
      ) : (
        <OTPValidation
          formData={formData}
          setFormData={setFormData}
          serverOtp={serverOtp}
          setShowOTPPanel={setShowOTPPanel}
          setServerOtp={setServerOtp}
        />
      )}
    </div>
  );
};

export default AuthForm;
