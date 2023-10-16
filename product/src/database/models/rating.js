const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    rating: {
        type: Number,
        require: true
    },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;