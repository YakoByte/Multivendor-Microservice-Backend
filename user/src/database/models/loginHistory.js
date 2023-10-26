const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
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

loginHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 * 24 * 60 * 60 }); // 10 Days

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
module.exports = LoginHistory;