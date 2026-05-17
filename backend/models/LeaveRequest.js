import mongoose from "mongoose";

const leaveRequestSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  medicalProof: {
    type: String
  },
  medicalCouncilStatus: {
  type: String,
  default: "Pending"
},

adminStatus: {
  type: String,
  default: "Pending"
},
adminDeleted: {
  type: Boolean,
  default: false
},

medicalDeleted: {
  type: Boolean,
  default: false
}
}, { timestamps: true });

export default mongoose.model("LeaveRequest", leaveRequestSchema);