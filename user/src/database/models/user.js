const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    loginHistoryId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoginHistory",
      },
    ],
  },
  { timestamps: true }
);

const Users = mongoose.model("User", userSchema);
module.exports = Users;
