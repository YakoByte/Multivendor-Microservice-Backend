const { ratingModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class RatingRepository {
  async calculateTotalRating(productId) {
    try {
      const ratings = await ratingModel.find({ productId });
      if (ratings.length === 0) {
        return 0;
      }

      let totalRating = 0;
      for (const data of ratings) {
        totalRating += data.rating / ratings.length;
      }

      return totalRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async CreateRating({ buyerId, productId, rating }) {
    try {
      const Rating = new ratingModel({
        buyerId: buyerId,
        productId: productId,
        rating: rating,
      });
      const RatingResult = await Rating.save();

      const totalRating = await calculateTotalRating(productId);
      return {RatingResult, totalRating};
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateRating({ buyerId, productId, rating }) {
    try {
      const RatingResult = await ratingModel.findOneAndUpdate({buyerId: buyerId, productId: productId}, {rating: rating}, {new: true});

      const totalRating = await calculateTotalRating(productId);
      return {RatingResult, totalRating};
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async BuyerRatingProduct({ buyerId, productId }) {
    try {
      const RatingResult = await ratingModel.findOne({
        buyerId: buyerId,
        productId: productId,
      });
      if (RatingResult) {
        return RatingResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindRatingProduct({ productId }) {
    try {
      const RatingResult = await ratingModel.findOne({ productId: productId });
      if (RatingResult) {
        const totalRating = await calculateTotalRating(productId);
        return {RatingResult, totalRating};
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindRatingBuyer({ buyerId }) {
    try {
      const RatingResult = await ratingModel.findOne({ buyerId: buyerId });
      if (RatingResult) {
        return RatingResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteRating({ buyerId, productId }) {
    try {
      const RatingResult = await ratingModel.findOneAndDelete({
        buyerId: buyerId,
        productId: productId,
      });
      if (RatingResult) {
        return RatingResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = RatingRepository;
