const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    message: {
        type: String,
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