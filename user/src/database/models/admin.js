const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    Address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
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