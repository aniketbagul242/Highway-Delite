import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  birthdate: {
    type: String,
    required: false // optional for Google login
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationCode: {
    type: String
  },

  //  New field for Google login
  googleId: {
    type: String,
    default: null
  }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);

export default userModel;
