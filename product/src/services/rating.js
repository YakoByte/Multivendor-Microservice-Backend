const { RatingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class RatingService {
  constructor() {
    this.repository = new RatingRepository();
  }

  async CreateRating(userInputs) {
    const { buyerId, productId, rating } = userInputs;
    try {
      const existingRating = await this.repository.BuyerRatingProduct({ buyerId, productId });
      if (!existingRating){
        const Rating = await this.repository.UpdateRating({ buyerId, productId, rating });
        return FormateData({ Rating });
      }

      const Rating = await this.repository.CreateRating({ buyerId, productId, rating });

      return FormateData({ Rating });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async BuyerRatingProduct(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const Rating = await this.repository.BuyerRatingProduct({ buyerId, productId });
      if(!Rating){
        return FormateData({message:"No Ratings Found"})
      }
      return FormateData({ Rating });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindRatingProduct(userInputs) {
    const { productId } = userInputs;
    try {
      const Rating = await this.repository.FindRatingProduct({ productId });
      if(!Rating){
        return FormateData({message:"No Ratings Found"})
      }
      return FormateData({ Rating });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindRatingBuyer(userInputs) {
    const { buyerId } = userInputs;
    try {
      const Rating = await this.repository.FindRatingBuyer({ buyerId });
      if (!Rating){
        return FormateData({ message: "Rating not found" })
      }
      return FormateData({ Rating });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteRating(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const Rating = await this.repository.DeleteRating({ buyerId, productId });
      if (!Rating){
        return FormateData({ message: "Rating not found" })
      }
      return FormateData({ Rating });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = RatingService;