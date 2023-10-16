const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
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

const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;
