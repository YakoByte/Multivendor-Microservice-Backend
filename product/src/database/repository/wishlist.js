const { wishlistModel, productModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class WishlistRepository {
  async CreateWishlist({ buyerId, productId }) {
    try {
      const Wishlist = new wishlistModel({
        buyerId: buyerId,
        productId: productId,
      });
      const WishlistResult = await Wishlist.save();
      return WishlistResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindWishlist({ buyerId }) {
    try {
      const WishlistResult = await wishlistModel.findOne({ buyerId: buyerId });
      if (WishlistResult) {
        const wishlist = [];
        for (const listItem of WishlistResult.items) {
          const product = await productModel.findOne({ _id: listItem.productId });
          wishlist.push({ list: listItem, product });
        }
  
        return wishlist;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindOneWishlist({ buyerId, productId }) {
    try {
      const WishlistResult = await wishlistModel.findOne({ buyerId: buyerId, productId: productId });
      if (WishlistResult) {
        return WishlistResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteWishlist({ buyerId, productId }) {
    try {
      const WishlistResult = await wishlistModel.findOneAndDelete({
        buyerId: buyerId,
        productId: productId,
      });
      if (WishlistResult) {
        return WishlistResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = WishlistRepository;