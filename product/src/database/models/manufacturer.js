const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true
    },
    description: {
        type:String,
    },
    enstablisedAt: {
        type : Number,
        default: 2023
    }
  },
  { timestamps: true }
);

const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);
module.exports = Manufacturer;