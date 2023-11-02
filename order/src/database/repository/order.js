const { orderModel, historyModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class OrderRepository {
  async CreateOrder({ orderId, userId, productId, totalPrice, quantity, offerId, couponId, shipmentAddress, paymentMethod, billPdf }) {
    try {
      const Order = new orderModel({
        orderId: orderId,
        userId: userId,
        productId: productId,
        quantity: quantity,
        offerId: offerId,
        couponId: couponId,
        totalPrice: totalPrice,
        shipmentAddress: shipmentAddress,
        paymentMethod: paymentMethod,
        billPdf: billPdf,
      });
      const OrderResult = await Order.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: OrderResult._id,
          action: "Order Created",
          date: new Date().toISOString(),
          time: Date.now(),
        },
        {
            objectId: OrderResult._id,
            action: "Bill Generated",
            date: new Date().toISOString(),
            time: Date.now(),
        }
        );
        await history.save();
      } else {
        const newHistory = new historyModel({
          userId: userId,
          log: [
            {
              objectId: OrderResult._id,
              action: "Order Created",
              date: new Date().toISOString(),
              time: Date.now(),
            },
            {
                objectId: OrderResult._id,
                action: "Bill Generated",
                date: new Date().toISOString(),
                time: Date.now(),
              },
          ],
        });
        await newHistory.save();
      }

      return OrderResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateOrder({ userId, orderId, status }) {
    try {
      const Order = orderModel.findOneAndUpdate(
        { orderId: orderId },
        { status: status },
        { new: true }
      );
      if (!Order) {
        return null;
      }

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: OrderResult._id,
          action: "Order Updated",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      } else {
        const newHistory = new historyModel({
          userId: userId,
          log: [
            {
              objectId: OrderResult._id,
              action: "Order Updated",
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await newHistory.save();
      }
      return Order;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindOrder({ userId }) {
    try {
      const OrderResult = await orderModel.find({ userId: userId });
      if (!OrderResult) {
        return null;
      }
      return OrderResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindAllOrder() {
    try {
      const OrderResult = await orderModel.find();
      if (!OrderResult) {
        return null;
      }
      return OrderResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetOneOrder({ orderId, userId }) {
    try {
      const OrderResult = await orderModel.findOne({ orderId: orderId, userId: userId });
      if (!OrderResult) {
        return null;
      }
      return OrderResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = OrderRepository;
