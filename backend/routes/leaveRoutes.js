import express from "express";
import LeaveRequest from "../models/LeaveRequest.js";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();


// ===============================
// MULTER STORAGE CONFIGURATION
// ===============================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({
  storage: storage
});


// ===============================
// NODEMAILER CONFIGURATION
// ===============================

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {

    user: "medshielduv@gemail.com",

    pass: "spxymrrvyjenzgoj"

  }

});


// ===============================
// CREATE LEAVE REQUEST
// ===============================

router.post(
  "/",
  upload.single("medicalProof"),
  async (req, res) => {

    try {

      // SAVE LEAVE REQUEST
      const leave = await LeaveRequest.create({

        studentName:
          req.body.studentName,

        registrationNumber:
          req.body.registrationNumber,

        reason:
          req.body.reason,

        fromDate:
          req.body.fromDate,

        toDate:
          req.body.toDate,

        medicalProof:
          req.file
            ? req.file.filename
            : ""

      });

    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    console.log(process.env.ADMIN_EMAIL);

      // SEND EMAIL TO ADMIN
      try {

  const info = await transporter.sendMail({

    from: "medshielduv@gmail.com",

    to: "fathimaabdhul20@gmail.com",

    subject: "New Medical Leave Request",

    text:
`A new leave request was submitted.

Student Name: ${leave.studentName}

Registration Number: ${leave.registrationNumber}

Reason: ${leave.reason}`

  });

  console.log("EMAIL SUCCESS");
  console.log(info);

} catch (emailError) {

  console.log("EMAIL ERROR");
  console.log(emailError);

}

console.log(info);

console.log("Email sent successfully");

      // RESPONSE
      res.status(201).json(leave);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }
  }
);


// ===============================
// GET ALL LEAVE REQUESTS
// ===============================

router.get("/", async (req, res) => {

  try {

    const leaves = await LeaveRequest.find();

    res.json(leaves);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


// ===============================
// GET SINGLE LEAVE REQUEST
// ===============================

router.get("/:id", async (req, res) => {

  try {

    const leave = await LeaveRequest.findById(
      req.params.id
    );

    res.json(leave);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


// ===============================
// UPDATE LEAVE STATUS
// ===============================

router.put("/:id", async (req, res) => {

  try {

    const updatedLeave =
      await LeaveRequest.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );

    res.json(updatedLeave);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


// ===============================
// DELETE LEAVE REQUEST
// ===============================

router.delete("/:id", async (req, res) => {

  try {

    await LeaveRequest.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Leave deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


export default router;