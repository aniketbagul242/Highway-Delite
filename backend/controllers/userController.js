import validator from "validator";
import { sendVerficationCode } from "../middleware/email.js";
import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken"; // Make sure this is imported
import axios from "axios";
import { oauth2Client } from "../utils/config.js";

// generating token
const CreateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN);
};


// user register
const userRegister = async (req, res) => {
  const { name, email, birthdate } = req.body;

  try {
    if (!name || !email || !birthdate) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "please enter valid email" })
    }
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    const verificationcode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new userModel({
      name,
      email,
      birthdate,
      verificationCode: verificationcode,
    });


    const user = await newUser.save();
    const token = CreateToken(user._id);

    await sendVerficationCode(user.email, verificationcode); // make sure it's awaited

    return res.json({
      success: true,
      message: "User Registered Successfully",
      token: token
    });
  } catch (error) {
    console.error("Register Error:", error); // helpful for debugging
    return res.json({ success: false, message: "Internal Error" });
  }
};


// login user
const loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Update user with verificationCode
    user.verificationCode = verificationCode;
    await user.save();

    // Send the OTP email
    await sendVerficationCode(user.email, verificationCode);

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.json({ success: false, message: "Internal Error" });
  }
};


// verifying otp from email
const verifyemail = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.json({ success: false, message: "No code provided" });
    }

    console.log("Code received from frontend:", code);

    const user = await userModel.findOne({ verificationCode: code });

    if (!user) {
      const allUsers = await userModel.find();
      console.log("Current DB state:", allUsers); // ⬅ Check this
      return res.json({ success: false, message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    const token = CreateToken(user._id);

    return res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.json({ success: false, message: "Internal server error" });
  }
};


// google login
const googleAuth = async (req, res) => {
  try {
    const { code, mode } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Missing Google authorization code.",
      });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );
    const { name, email, sub: googleId } = userRes.data;

    // Check for existing user
    let user = await userModel.findOne({ email });

    if (mode === "signup") {
      if (user) {
        return res.status(200).json({
          success: false,
          message: "User already exists. Please log in.",
        });
      }

      user = new userModel({
        name,
        email,
        googleId,
        isVerified: true,
      });
      await user.save();

      const token = CreateToken(user._id);
      return res.status(201).json({
        success: true,
        message: "Signup successful",
        user: { name: user.name, email: user.email },
        token,
      });
    }

    if (mode === "signin") {
      if (!user) {
        return res.status(200).json({
          success: false,
          message: "No account found. Please sign up using Google.",
        });
      }

      if (!user.googleId) {
        return res.status(200).json({
          success: false,
          message: "This email was not registered via Google. Use OTP login.",
        });
      }

      if (user.googleId !== googleId) {
        return res.status(200).json({
          success: false,
          message: "Google account mismatch. Use the correct Google account.",
        });
      }

      const token = CreateToken(user._id);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: { name: user.name, email: user.email },
        token,
      });
    }

    // Invalid mode
    return res.status(200).json({
      success: false,
      message: "Invalid mode. Must be 'signup' or 'signin'.",
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during Google authentication.",
    });
  }
};


export { userRegister, loginUser, verifyemail, googleAuth };
