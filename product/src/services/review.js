const { ReviewRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ReviewService {
  constructor() {
    this.repository = new ReviewRepository();
  }

  async CreateReview(userInputs) {
    const { buyerId, productId, review } = userInputs;
    try {
      const existingReview = await this.repository.BuyerReviewProduct({ buyerId, productId });
      if (!existingReview){
        const Review = await this.repository.UpdateRating({ buyerId, productId, review });
        return FormateData({ Review });
      }

      const Review = await this.repository.CreateReview({ buyerId, productId, review });

      return FormateData({ Review });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async BuyerReviewProduct(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const Review = await this.repository.BuyerReviewProduct({ buyerId, productId });
      if(!Review){
        return FormateData({message:"No Reviews Found"})
      }
      return FormateData({ Review });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindReviewProduct(userInputs) {
    const { productId } = userInputs;
    try {
      const Review = await this.repository.FindReviewProduct({ productId });
      if(!Review){
        return FormateData({message:"No Reviews Found"})
      }
      return FormateData({ Review });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindReviewBuyer(userInputs) {
    const { buyerId } = userInputs;
    try {
      const Review = await this.repository.FindReviewBuyer({ buyerId });
      if (!Review){
        return FormateData({ message: "Review not found" })
      }
      return FormateData({ Review });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteReview(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const Review = await this.repository.DeleteReview({ buyerId, productId });
      if (!Review){
        return FormateData({ message: "Review not found" })
      }
      return FormateData({ Review });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = ReviewService;