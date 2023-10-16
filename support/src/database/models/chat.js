const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    sellerId: {
        type :  mongoose.Schema.Types.ObjectId ,
        ref :"User"
    }
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;