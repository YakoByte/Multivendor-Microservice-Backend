const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: String,
      required: true,
    },
    logo: {
      imagePath: {
        type: String,
        required: true,
        default: "bit.ly/3NgVNGV",
      },
      mimeType: {
        type: String,
        required: true,
        default: "image/jpeg",
      },
      imageSize: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
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
    description: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
