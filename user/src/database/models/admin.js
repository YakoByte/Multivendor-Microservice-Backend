const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    genderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
    },
    contact: [
      {
        phoneNo: {
          type: Number,
          unique: true,
        },
        email: {
          type: String,
          unique: true,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;