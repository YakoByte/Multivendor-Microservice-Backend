const mongoose = require("mongoose");

const historySchema = new mongoose(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
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