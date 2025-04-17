const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Unique constraint, but use indexes in DB
      trim: true,
      lowercase: true, // Ensure email is stored in lowercase for consistency
      index: true, // This creates an index for the email field
    },
    password: {
      type: String,
      required: true,
    },
    // Automatically adds `createdAt` and `updatedAt` fields
  },
  {
    timestamps: true, // Mongoose will handle `createdAt` and `updatedAt` for you
  }
);

module.exports = mongoose.model("User", UserSchema);
