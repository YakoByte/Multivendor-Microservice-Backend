const NotificationService = require("../services/notification");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new NotificationService();

  app.post("/notification", UserAuth, async (req, res, next) => {
    try {
      const { userId, type, message } = req.body;
      const { data } = await service.CreateNotification({ userId, type, message });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/notification", UserAuth, async (req, res, next) => {
    try {
      const { customId } = req.body;
      const data = await service.FindNotification({ customId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get("/notification/user", UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const data = await service.GetNotification({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/notification", UserAuth, async (req, res, next) => {
    try {
      const { customId } = req.body;
      const data = await service.DeleteNotification({ customId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};