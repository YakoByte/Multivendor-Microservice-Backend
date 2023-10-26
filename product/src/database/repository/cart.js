const { cartModel } = require("../models");
const { productModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class CartRepository {
  async calculateTotalPrice(productId, quantity) {
    try {
      const _id = productId;
      const totalQuantity = quantity;
      const product = await productModel.findById(_id);
      if (product.length === 0) {
        return 0;
      }

      let totalPrice = product.price * totalQuantity;

      return totalPrice;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async CreateCart({ buyerId, productId, quantity }) {
    try {
      const totalPrice = await this.calculateTotalPrice(productId, quantity);
      const Cart = new cartModel({
        buyerId: buyerId,
        productId: productId,
        quantity: quantity,
        totalPrice: totalPrice,
      });
      const CartResult = await Cart.save();
      return CartResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindCart({ buyerId }) {
    try {
      const CartResult = await cartModel.findOne({ buyerId: buyerId });
      if (CartResult) {
        return CartResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindOneCart({ buyerId, productId }) {
    try {
      const CartResult = await cartModel.findOne({ buyerId: buyerId, productId: productId });
      if (CartResult) {
        return CartResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateCart({ buyerId, productId, quantity }) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { buyerId: buyerId, productId: productId },
        { quantity: quantity },
        { new: true }
      );
  
      if (!cart) {
        return null;
      }
  
      return cart;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async DeleteCart({ buyerId, productId }) {
    try {
      const CartResult = await cartModel.findOneAndDelete({
        buyerId: buyerId,
        productId: productId,
      });
      if (CartResult) {
        return CartResult;
      }
      return null;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = CartRepository;
