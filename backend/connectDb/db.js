import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URI;
const connectDb = async ()=>{
  try {
    await mongoose.connect(url)
    console.log("connect db");
    
  } catch (error) {
    console.log(error);
    
  }
}

export default connectDb;