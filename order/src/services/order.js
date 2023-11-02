const { OrderRepository } = require("../database");
const { FormateData, FormatDate, createBillPDF } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class OrderService {
  constructor() {
    this.repository = new OrderRepository();
  }

  async CreateOrder(userInputs) {
    const { userId, UserData, UserProfileData, ProductData, productId, quantity, offerId, couponId, shipmentAddress, paymentMethod } = userInputs;
    try {
      const currentDate = FormatDate();
      const orderId = `${userId}-${currentDate}`;
      
      const price = ProductData.finalPrice;
      const totalPrice = price * quantity;

      const existingOrder = await this.repository.GetOneOrder({ orderId });
      if (existingOrder) {
        return FormateData({ message: "Order already exists" });
      }
  
      const billNumber = orderId;
  
      const billData = {
        BillNumber: billNumber,
        BillDate: new Date(),
        ShipmentAddress: shipmentAddress,
        Products: ProductData,
        User: UserData,
        Profile: UserProfileData,
        PaymentMethod: paymentMethod,
        Quantity: quantity,
        SumTotal: totalPrice,
      };
      const billPdf = await createBillPDF(billData);
  
      const OrderResult = await this.repository.CreateOrder({ orderId, userId, productId, totalPrice, quantity, offerId, couponId, shipmentAddress, paymentMethod, billPdf });
  
      return FormateData({ OrderResult });
    } catch (err) {
      throw new APIError("Order creation failed", err);
    }
  }

  async GetOneOrder(userInputs) {
    try {
      const { orderId, userId } = userInputs;
      const Order = await this.repository.GetOneOrder({ orderId, userId });
      if (!Order) {
        return FormateData({ message: "No such Order exist" });
      }
      return FormateData({ Order });
    } catch (error) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindOrder(userInputs) {
    try {
      const { userId } = userInputs;
      const Order = await this.repository.FindOrder({ userId });
      if (!Order) {
        return FormateData({ message: "No Order exist" });
      }
      return FormateData({ Order });
    } catch (error) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindAllOrder() {
    try {
      const Order = await this.repository.FindAllOrder();
      if (!Order) {
        return FormateData({ message: "No Order exist" });
      }
      return FormateData({ Order });
    } catch (error) {
      throw new APIError("Data Not found", err);
    }
  }

  async UpdateOrder(userInputs) {
    try {
      const { userId, orderId, status } = userInputs;
      let updatedOrder = await this.repository.UpdateOrder(userId, orderId, status);
      if (!updatedOrder) {
        return FormateData({ message: "Failed to update the Order" });
      }
      return FormateData({ updatedOrder });
    } catch (error) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = OrderService;
