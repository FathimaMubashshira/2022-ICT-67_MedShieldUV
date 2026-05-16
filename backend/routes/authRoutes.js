import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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

  const adminUser = {
    name: "Admin",
    registrationNumber: "ADMIN001",
    role: "admin"
  };

  const token = jwt.sign(
    {
      role: "admin"
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return res.json({
    message: "Admin Login Successful",
    token,
    user: adminUser
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

  const token = jwt.sign({
    id: user._id,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1d"
  }
);

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

export default router;