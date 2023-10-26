const { CartRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class CartService {
  constructor() {
    this.repository = new CartRepository();
  }

  async CreateCart(userInputs) {
    const { buyerId, productId, quantity } = userInputs;
    try {
      const existingCart = await this.repository.FindOneCart({ buyerId, productId });
      if (existingCart){
        return FormateData({ message: "Cart already exist" })
      }

      const Cart = await this.repository.CreateCart({ buyerId, productId, quantity });

      return FormateData({ Cart });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindCart(userInputs) {
    const { buyerId } = userInputs;
    try {
      const Cart = await this.repository.FindCart({ buyerId });
      if (!Cart){
        return FormateData({ message: "Cart not found" })
      }
      return FormateData({ Cart });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async UpdateCart(userInputs) {
    const { buyerId, productId, quantity } = userInputs;
    try {
        const Cart = await this.repository.UpdateCart({ buyerId, productId, quantity });
        if (!Cart){
            return FormateData({ message: "Cart not updated" })
        }
        return FormateData({ Cart });
    } catch (error) {
        throw new APIError("Data Not found", err);
    }
  }

  async DeleteCart(userInputs) {
    const { buyerId, productId } = userInputs;
    try {
      const Cart = await this.repository.DeleteCart({ buyerId, productId });
      if (!Cart){
        return FormateData({ message: "Cart not found" })
      }
      return FormateData({ Cart });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = CartService;