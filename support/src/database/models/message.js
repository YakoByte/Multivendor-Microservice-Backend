const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    message: {
      type: String,
      trim: true,
    },
    attachmentId: {
        type :  mongoose.Schema.Types.ObjectId ,
        ref :"Attachment"
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;