const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    IP: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    system: {
      type: String,
      required: true,
    },
    isLogedIn: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

loginHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 1 month

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
module.exports = LoginHistory;
