const ReturnService = require("../services/return");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ReturnService();

  app.post("/return", UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { orderId, productId, quantity, refundAmount, reason } = req.body;

      const result = await service.CreateReturn({ userId, orderId, productId, quantity, refundAmount, reason });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/return/one",UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { orderId } = req.body;

      const result = await service.FindReturnOrder({ orderId, userId });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/return",UserAuth, async (req, res, next) => {
    try {
      const result = await service.FindReturn();
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.put("/return",UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { orderId, status } = req.body;

      const result = await service.UpdateReturn({ userId, orderId, status });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
