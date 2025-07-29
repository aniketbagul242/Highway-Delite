import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: ''
  });

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.email || !formData.email.includes('@') || !formData.email.includes('.')) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://note-app-backend-ns8k.onrender.com/api/user/register", {
        name: formData.name,
        birthdate: formData.dob,
        email: formData.email
      });

      if (response.data.success) {
        setMessage("OTP sent to email. Please enter it below.");
        setShowOtpInput(true);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }

    setLoading(false);
  };

  const handleOtpVerify = async () => {
    try {
      const res = await axios.post("https://note-app-backend-ns8k.onrender.com/api/user/verifyemail", {
        code: formData.otp
      });

      if (res.data.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setMessage("Email verified successfully.");
        navigate("/dashboard");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("OTP verification failed");
    }
  };

  const responseGoogle = async (response) => {
    try {
      if (response.code) {
        const result = await axios.get(`https://note-app-backend-ns8k.onrender.com/api/user/googleauth?code=${response.code}&mode=signup`);
        setMessage(result.data.message);
        setToken(result.data.token);
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const Logingoogle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  });

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md p-6 rounded-lg">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1">
              <img src="search.png" className='w-5' alt="HD Logo" />
              <p className="font-bold text-lg">HD</p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-2">Sign up</h2>
            <p className="text-sm text-gray-500">Sign up to enjoy the feature of HD</p>
          </div>

          {message && <p className="text-center text-red-500 mb-2">{message}</p>}

          <form onSubmit={handleRegister}>
            <label className="block text-sm text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jonas Khanwald"
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />

            <label className="block text-sm text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />

            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full mb-4 px-4 py-2 border rounded-md"
              required
            />

            {!showOtpInput && (
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-2 rounded-md transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Sending OTP...
                  </div>
                ) : 'Get OTP'}
              </button>
            )}
          </form>

          {showOtpInput && (
            <>
              <label className="block text-sm text-gray-700 mt-4 mb-1">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                className="w-full mb-4 px-4 py-2 border rounded-md"
              />

              <button onClick={handleOtpVerify} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                Verify OTP
              </button>
            </>
          )}

          <div className="mt-4">
            <button onClick={() => Logingoogle()}
              className="w-full flex items-center justify-center gap-3 bg-white text-black border border-gray-300 shadow-md rounded-md py-2 hover:bg-gray-100 transition"
            >
              <img src="google.png" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">Sign up with Google</span>
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:block md:w-1/2 h-screen">
        <img src="bg.jpg" alt="Signup Background" className="w-full h-full object-cover -ml-4 rounded-3xl" />
      </div>
    </div>
  );
};

export default Signup;
