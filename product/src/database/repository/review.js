const { reviewModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ReviewRepository {
  async CreateReview({ buyerId, productId, review }) {
    try {
      const Review = new reviewModel({
        buyerId: buyerId,
        productId: productId,
        review: review
      });
      const ReviewResult = await Review.save();
      return ReviewResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateReview({ buyerId, productId, review }) {
    try {
      const ReviewResult = await reviewModel.findOneAndUpdate({buyerId: buyerId, productId: productId}, {review: review}, {new: true});
      return ReviewResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async BuyerReviewProduct({ buyerId, productId }) {
    try {
      const ReviewResult = await reviewModel.findOne({ buyerId: buyerId, productId: productId });
      if (ReviewResult) {
        return ReviewResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindReviewProduct({ productId }) {
    try {
      const ReviewResult = await reviewModel.findOne({ productId: productId });
      if (ReviewResult) {
        return ReviewResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindReviewBuyer({ buyerId }) {
    try {
      const ReviewResult = await reviewModel.findOne({ buyerId: buyerId });
      if (ReviewResult) {
        return ReviewResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteReview({ buyerId, productId }) {
    try {
      const ReviewResult = await reviewModel.findOneAndDelete({
        buyerId: buyerId,
        productId: productId,
      });
      if (ReviewResult) {
        return ReviewResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = ReviewRepository;