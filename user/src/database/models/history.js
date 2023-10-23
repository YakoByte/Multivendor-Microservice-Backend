const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    log: [{
        objectId: mongoose.Schema.Types.ObjectId,
        action: String,
        data: Object,
        date: String,
        time: Date,
      }],
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
module.exports = History;