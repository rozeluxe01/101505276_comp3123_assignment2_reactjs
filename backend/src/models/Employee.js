import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "invalid email"],
    },
    position: { type: String, required: true, trim: true, maxlength: 100 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    salary: { type: Number, required: true, min: 0 },
    dateOfJoining: { type: Date, required: true },

    // profile picture relative URL
    profilePic: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

employeeSchema.index({ department: 1, lastName: 1 });

export const Employee = mongoose.model("Employee", employeeSchema);
