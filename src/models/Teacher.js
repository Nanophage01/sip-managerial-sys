import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    teacherId: {
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
    department: {
      type: String,
      required: true,
    },
    courses: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
