import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "*", //restrict to frontend URL later
  }),
);

app.use(express.json());

/* API routes */
app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected with Database!");
  } catch (error) {
    console.log("Failed to connect with DB", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
};

startServer();

app.get("/", (req, res) => {
  res.send("API is running...");
});
