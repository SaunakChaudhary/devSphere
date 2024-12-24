/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import { UserDataContext } from "../Context/UserContext";
import SyncLoader from "react-spinners/SyncLoader";

const OTPValidation = ({ formData, setFormData, serverOtp }) => {
  const isLocalhost = window.location.hostname === "localhost";
  const API_BASE_URL = isLocalhost
    ? "http://localhost:5000"
    : "hhttps://devsphere-backend-bxxx.onrender.com";

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!timeLeft && isActive) {
      setIsActive(false);
      return;
    }

    const timer = setInterval(() => {
      if (isActive) {
        setTimeLeft((time) => time - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    setError("");

    // Focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = ""; // Clear the current input
  
      // Only move the focus to the previous input if it's empty
      if (!newOtp[index] && index > 0) {
        inputRefs.current[index - 1].focus(); // Focus the previous input field
      }
  
      setOtp(newOtp);
      setError(""); // Clear the error message if any
    }
  };
  

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.some((char) => isNaN(char))) return;

    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6) newOtp[index] = value;
    });
    setOtp(newOtp);
    if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (otp.some((digit) => digit === "")) {
      e.preventDefault();

      setError("Please enter all digits");
      return;
    }

    const OTP = otp.join("");

    // Add your verification logic here
    if (OTP !== serverOtp) {
      setError("Invalid OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/manual-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/interest");
        setFormData({
          email: "",
          password: "",
          name: "",
          gitHuburl: "",
          linkedInUrl: "",
        });
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error while creating account" + error);
    }
  };

  const handleResend = () => {
    setTimeLeft(30);
    setIsActive(true);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0].focus();
    // Add your resend logic here
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
      {loading && (
        <div className="flex justify-center items-center text-white fixed top-0 w-full h-screen bg-black bg-opacity-45 z-50">
          <SyncLoader color="skyblue" loading={loading} size={15} />
        </div>
      )}
      <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
        <div className="text-center mb-8">
          <i className="ri-shield-check-line text-4xl text-blue-500 mb-4"></i>
          <h2 className="text-2xl font-black">Verify Your Email</h2>
          <p className="text-gray-600 font-bold mt-2">
            We&apos;ve sent a 6-digit OTP to your email
          </p>
          <p className="text-blue-500 font-bold">{formData.email}</p>
        </div>

        {/* OTP Input Fields */}
        <div className="mb-8">
          <div className="flex gap-2 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 border-4 border-black text-center text-xl font-bold rounded-lg focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm font-bold text-center">
              {error}
            </p>
          )}
        </div>

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          {isActive ? (
            <p className="text-gray-600 font-bold">
              Resend OTP in {timeLeft} seconds
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-500 font-bold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 border-2 border-black hover:bg-blue-600 transition-colors rounded-lg"
        >
          Verify OTP
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-4 bg-gray-100 text-gray-700 font-bold py-3 px-4 border-2 border-black hover:bg-gray-200 transition-colors rounded-lg flex items-center justify-center gap-2"
        >
          <i className="ri-arrow-left-line"></i>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default OTPValidation;
