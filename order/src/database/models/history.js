const mongoose = require("mongoose");

const historySchema = new mongoose(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    log: {
        actionType: String,
        data: Object,
        time: Date,
      },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
module.exports = History;
