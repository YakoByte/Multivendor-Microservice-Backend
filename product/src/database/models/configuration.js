const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true
    },
    value: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

const Configuration = mongoose.model("Configuration", configurationSchema);
module.exports = Configuration;