import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "invalid email"],
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ username: 1 });

export const User = mongoose.model("User", userSchema);
