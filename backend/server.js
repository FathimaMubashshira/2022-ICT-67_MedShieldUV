import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import leaveRoutes from "./routes/leaveRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/medshield")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

app.get("/", (req, res) => {
  res.send("MedShield API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});