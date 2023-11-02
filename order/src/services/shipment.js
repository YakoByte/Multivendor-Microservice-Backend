const { ShipmentRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ShipmentService {
  constructor() {
    this.repository = new ShipmentRepository();
  }

  async CreateShipment(userInputs) {
    const { orderId, sellerId, buyerId, pickUpAddressId, city, state, countryCode, deliveryAddressId, estimateDate } = userInputs;
    try {
        const existingShipment = await this.repository.FindShipment({orderId});
        if (!existingShipment){
            return FormateData({ message: "Shipment already exist" })
        }

        const Shipment = await this.repository.CreateShipment({ orderId, sellerId, buyerId, pickUpAddressId, city, state, countryCode, deliveryAddressId, estimateDate });

        return FormateData({ Shipment });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindShipment(userInputs) {
    try {
        const {orderId, userId} = userInputs;
        const Shipment = await this.repository.FindShipment({orderId, userId});
        if(!Shipment) {
            return FormateData({ message: 'No Shipment exist' });
        }
        return FormateData({ Shipment });
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindAllShipment() {
    try {
        const Shipment = await this.repository.FindAllShipment();
        if(!Shipment) {
            return FormateData({ message: 'No Shipment exist' });
        }
        return FormateData({ Shipment });
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }

  async UpdateShipment(userInputs) {
    try {
        const { orderId, city, state, countryCode } = userInputs;
        const updatedShipment = await this.repository.UpdateShipment(orderId, city, state, countryCode);
        if (!updatedShipment) {
            return FormateData({ message: "Failed to update the Shipment" });
        }
        return FormateData({ updatedShipment });
    } catch (error) {
        throw new APIError("Data Not found", err);
    }
  }
}

module.exports = ShipmentService;