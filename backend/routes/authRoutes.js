import express from "express";
import User from "../models/User.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {

  try {

    const {
      name,
      registrationNumber,
      password
    } = req.body;

    const user = await User.create({
      name,
      registrationNumber,
      password,
      role: "student"
    });

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

// LOGIN
router.post("/login", async (req, res) => {

  try {

    const {
      registrationNumber,
      password
    } = req.body;

    // HARD CODED ADMIN
    if (
      registrationNumber === "ADMIN001" &&
      password === "admin"
    ) {

      return res.json({
        message: "Admin Login Successful",
        user: {
          name: "Admin",
          registrationNumber: "ADMIN001",
          role: "admin"
        }
      });

    }

    // STUDENT LOGIN
    const user = await User.findOne({
      registrationNumber
    });

    if (!user) {

      return res.status(400).json({
        message: "User not found"
      });

    }

    if (user.password !== password) {

      return res.status(400).json({
        message: "Incorrect password"
      });

    }

    res.json({
      message: "Login successful",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

export default router;