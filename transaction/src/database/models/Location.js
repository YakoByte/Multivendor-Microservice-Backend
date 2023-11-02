const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    IPAddress: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "World"
    },
    system: {
      type: String,
      required: true,
    },
    OS: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
    isLogedIn: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

locationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); 

const LocationHistory = mongoose.model("Location", locationSchema);
module.exports = LocationHistory;