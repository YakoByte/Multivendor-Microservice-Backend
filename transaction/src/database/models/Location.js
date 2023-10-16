const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    transactionId: {
        type : String,
        required : true,
    },
    IP: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    system: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;