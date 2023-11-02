const ShipmentService = require("../services/shipment");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ShipmentService();

  app.post("/shipment", UserAuth, async (req, res, next) => {
    try {
      const { orderId, sellerId, buyerId, pickUpAddressId, city, state, countryCode, deliveryAddressId, estimateDate } = req.body;

      const result = await service.CreateShipment({ orderId, sellerId, buyerId, pickUpAddressId, city, state, countryCode, deliveryAddressId, estimateDate });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/shipment/one",UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { orderId } = req.body;

      const result = await service.FindShipment({ orderId, userId });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/shipment",UserAuth, async (req, res, next) => {
    try {
      const result = await service.FindAllShipment();
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.put("/shipment",UserAuth, async (req, res, next) => {
    try {
      const { orderId, city, state, countryCode } = req.body;

      const result = await service.UpdateOrder({ orderId, city, state, countryCode });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};