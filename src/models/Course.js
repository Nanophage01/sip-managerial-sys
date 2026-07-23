import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
