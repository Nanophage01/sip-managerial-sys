import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
});

const GradeSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    finalGrade: {
      type: String,
      required: true,
    },
    gpaPoints: {
      type: String,
      required: true,
    },
    assessments: [AssessmentSchema],
  },
  { timestamps: true }
);

GradeSchema.index({ studentId: 1, courseCode: 1 }, { unique: true });

export default mongoose.models.Grade || mongoose.model("Grade", GradeSchema);
