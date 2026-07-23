import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Enrolled", "Suspended", "Graduated", "Inactive"],
      default: "Enrolled",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
