const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        require: true
    },
  },
  { timestamps: true }
);

const Badge = mongoose.model("Badge", badgeSchema);
module.exports = Badge;
