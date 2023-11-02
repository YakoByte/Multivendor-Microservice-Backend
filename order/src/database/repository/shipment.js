const { shipmentModel, historyModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ShipmentRepository {
  async CreateShipment({ orderId, sellerId, buyerId, pickUpAddressId, city, state, countryCode, deliveryAddressId, estimateDate }) {
    try {
      const Shipment = new shipmentModel({
        orderId: orderId,
        sellerId: sellerId,
        buyerId: buyerId,
        pickUpAddressId: pickUpAddressId,
        CurrentAddress: {city: city, state: state, countryCode: countryCode},
        deliveryAddressId: deliveryAddressId,
        estimateDate: estimateDate,
      });
      const ShipmentResult = await Shipment.save();

      const history = await historyModel.findOne({ userId: buyerId });
      if (history) {
        history.log.push({
          objectId: ShipmentResult._id,
          action: "Shipment Created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      } else {
        const newHistory = new historyModel({
          userId: buyerId,
          log: [
            {
              objectId: ShipmentResult._id,
              action: "Shipment Created",
              date: new Date().toISOString(),
              time: Date.now(),
            },
          ],
        });
        await newHistory.save();
      }

      return ShipmentResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindShipment({ userId, orderId }) {
    try {
      const ShipmentResult = await shipmentModel.findOne({ orderId: orderId, buyerId: userId });
      if (ShipmentResult) {
        return ShipmentResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindAllShipment() {
    try {
      const ShipmentResult = await shipmentModel.find();
      if (ShipmentResult) {
        return ShipmentResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateShipment({ orderId, city, state, countryCode }) {
    try {
      const updatedShipment = await shipmentModel.findOneAndUpdate(
        { orderId: orderId },
        {
          $set: {
            "CurrentAddress.city": city,
            "CurrentAddress.state": state,
            "CurrentAddress.countryCode": countryCode,
          },
        },
        { new: true }
      );
  
      if (updatedShipment) {
        return updatedShipment;
      }
  
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = ShipmentRepository;