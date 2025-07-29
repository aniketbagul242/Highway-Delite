import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDb from "./connectDb/db.js";
import userRouter from "./routes/userRoutes.js";
import noteRouter from "./routes/noteRoutes.js";


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())

//database connection
connectDb();

//api endpoint
app.use("/api/user", userRouter)
app.use("/api/notes", noteRouter);


app.get("/", (req, res) => {
    res.send("Api is working")
})

app.listen(PORT, () => {
    console.log("server is runniing on", PORT);

})



