const mongoose = require("mongoose");

const historySchema = new mongoose(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    log: {
        actionType: String,
        data: Object,
        time: Date,
      },
  },
  { timestamps: true }
);

historySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 1 month

const History = mongoose.model("History", historySchema);
module.exports = History;