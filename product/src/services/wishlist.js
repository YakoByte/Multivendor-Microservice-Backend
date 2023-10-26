const { WishlistRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class WishlistService {
  constructor() {
    this.repository = new WishlistRepository();
  }

  async CreateWishlist(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const existingWishlist = await this.repository.FindOneWishlist({ buyerId, productId });
      if (existingWishlist){
        return FormateData({ message: "Wishlist already exist" })
      }

      const Wishlist = await this.repository.CreateWishlist({ buyerId, productId });

      return FormateData({ Wishlist });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetWishlist(userInputs) {
    const { buyerId } = userInputs;
    try {
      const Wishlist = await this.repository.FindWishlist({ buyerId });
      if (!Wishlist){
        return FormateData({ message: "Wishlist not found" })
      }
      return FormateData({ Wishlist });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteWishlist(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const Wishlist = await this.repository.DeleteWishlist({ buyerId, productId });
      if (!Wishlist){
        return FormateData({ message: "Wishlist not found" })
      }
      return FormateData({ Wishlist });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = WishlistService;