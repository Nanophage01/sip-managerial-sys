import mongoose from "mongoose";

const AttendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Present", "Absent", "Late"],
    default: "Present",
  },
});

const AttendanceSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    records: [AttendanceRecordSchema],
  },
  { timestamps: true }
);

// Prevent duplicate logs for same course on same day
AttendanceSchema.index({ courseCode: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
