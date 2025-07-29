import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { StoreContext } from "../../context/StoreContext";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("https://note-app-backend-ns8k.onrender.com/api/user/login", { email });
      if (res.data.success) {
        setMessage("OTP sent to your email.");
        setOtpSent(true);
      } else {
        setMessage(res.data.message);
        setOtpSent(false);
      }
    } catch (err) {
      setMessage("Error sending OTP.");
      setOtpSent(false);
    }
    setLoading(false);
  };


  // verifying otp
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://note-app-backend-ns8k.onrender.com/api/user/verifyemail", { code: otp });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        navigate("/dashboard");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Error verifying OTP.");
    }
    setLoading(false);
  };

  const responseGoogle = async (response) => {
    try {
      if (response.code) {
        const result = await axios.get(
          `https://note-app-backend-ns8k.onrender.com/api/user/googleauth?code=${response.code}&mode=signin`
        );
        if (result.data.success) {
          setToken(result.data.token);
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));
          navigate("/dashboard");
        }
        setMessage(result.data.message);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Error during Google login.");
    }
  };

  const Logingoogle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 flex justify-center items-center px-6 py-10 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <img src="/search.png" alt="logo" className="w-6 inline-block" />
            <span className="ml-2 text-xl font-bold text-blue-700">HD</span>
            <h2 className="text-2xl font-semibold mt-2">Sign In</h2>
            <p className="text-gray-500 text-sm">
              Please login to continue to your account.
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit}>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-md ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>

          {/* Show OTP input if OTP was sent */}
          {otpSent && (
            <form onSubmit={handleOtpVerify} className="mt-4">
              <label className="block mb-1 text-sm text-gray-700">OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter OTP"
              />
              <div className="flex justify-between items-center mb-3">
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Resend OTP
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>
          )}

          {/* Show Message */}
          {message && (
            <p
              className={`text-sm text-center mt-4 ${message.toLowerCase().includes("error") ||
                  message.toLowerCase().includes("failed") ||
                  message.toLowerCase().includes("invalid")
                  ? "text-red-500"
                  : "text-blue-600"
                }`}
            >
              {message}
            </p>
          )}

          {/* Google Sign In Button (Always at bottom) */}
          <div className="mt-6">
            <button
              onClick={() => Logingoogle()}
              className="w-full flex items-center justify-center gap-3 bg-white text-black border border-gray-300 shadow-md rounded-md py-2 hover:bg-gray-100 transition"
            >
              <img src="google.png" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-4">
            Don’t have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="hidden md:block md:w-1/2">
        <img
          src="/bg.jpg"
          alt="Signin Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Signin;
