const mongoose = require("mongoose");

const platformFeedbackSchema = new mongoose.Schema(
  {
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    type: {
        type: String,
        require: true
    },
    message: {
        type: String,
    }
  },
  { timestamps: true }
);

const PlatformFeedback = mongoose.model("PlatformFeedback", platformFeedbackSchema);
module.exports = PlatformFeedback;