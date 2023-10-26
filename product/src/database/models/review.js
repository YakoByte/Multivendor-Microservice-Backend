const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    review: {
        type: String,
        require: true
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;