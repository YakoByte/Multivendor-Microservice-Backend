const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
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

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);
module.exports = LoginHistory;
