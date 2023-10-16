const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    passwordQuestion: {
      type: String,
      required: true,
    },
    passwordAnswer: {
      type: String,
      required: true,
    },
    history: [
      {
        type: Date,
        default: null,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Password = mongoose.model("Password", passwordSchema);
module.exports = Password;
