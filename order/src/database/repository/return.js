const { returnModel, orderModel, shipmentModel, historyModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ReturnRepository {
  async CreateReturn({ userId, orderId, productId, quantity, refundAmount, reason }) {
    try {
      const newReturn = new returnModel({
        orderId: orderId,
        productId: productId,
        quantity: quantity,
        refundAmount: refundAmount,
        reason: reason,
      });
      const returnResult = await newReturn.save();
      if (!returnResult) {
        return null;
      }

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: returnResult._id,
          action: "Return Created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      } else {
        const newHistory = new historyModel({
          userId: userId,
          log: [{
              objectId: returnResult._id,
              action: "Return Created",
              date: new Date().toISOString(),
              time: Date.now(),
            }],
        });
        await newHistory.save();
      }

      return returnResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindReturnOrder({ orderId, userId }) {
    try {
      const ReturnResult = await returnModel.findOne({ orderId: orderId, userId: userId });
      if (ReturnResult) {
        return ReturnResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindReturn() {
    try {
      const ReturnResult = await returnModel.find();
      if (ReturnResult) {
        return ReturnResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateReturn({ userId, orderId, status }) {
    try {
      const updatedReturn = await returnModel.findOneAndUpdate(
        { orderId: orderId },
        { status: status },
        { new: true }
      );

      if (updatedReturn && updatedReturn.status === "Accepted") {
        const deletedShipment = await shipmentModel.findOneAndDelete({orderId: orderId});
        const Order = await orderModel.findOneAndUpdate({ orderId: orderId }, { status: "Cancel" }, { new: true });
        const history = await historyModel.findOne({ userId: userId });
        if (history) {
          history.log.push(
            {
              objectId: updatedReturn._id,
              action: "Return Accepted",
              date: new Date().toISOString(),
              time: Date.now(),
            },
            {
              objectId: deletedShipment._id,
              action: "Shipment Deleted",
              date: new Date().toISOString(),
              time: Date.now(),
            },
            {
              objectId: Order._id,
              action: "Order status updated to Cancel",
              date: new Date().toISOString(),
              time: Date.now(),
            },
          );
          await history.save();
        } else {
          const newHistory = new historyModel({
            userId: userId,
            log: [
              {
                objectId: updatedReturn._id,
                action: "Return Accepted",
                date: new Date().toISOString(),
                time: Date.now(),
              },
              {
                objectId: deletedShipment._id,
                action: "Shipment Deleted",
                date: new Date().toISOString(),
                time: Date.now(),
              },
              {
                objectId: Order._id,
                action: "Order status updated to Cancel",
                date: new Date().toISOString(),
                time: Date.now(),
              },
            ],
          });
          await newHistory.save();
        }

        return updatedReturn;
      }

      if (updatedReturn && updatedReturn.status === "Rejected") {
        const history = await historyModel.findOne({ userId: userId });
        if (history) {
          history.log.push(
            {
              objectId: updatedReturn._id,
              action: "Return Rejected",
              date: new Date().toISOString(),
              time: Date.now(),
            }
          );
          await history.save();
        } else {
          const newHistory = new historyModel({
            userId: userId,
            log: [{
                objectId: updatedReturn._id,
                action: "Return Accepted",
                date: new Date().toISOString(),
                time: Date.now(),
              }],
          });
          await newHistory.save();
        }

        return updatedReturn;
      }

      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = ReturnRepository;