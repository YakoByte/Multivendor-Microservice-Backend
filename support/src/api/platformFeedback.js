const FeedbackService = require("../services/platformFeedback");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new FeedbackService();

  app.post("/feedback", UserAuth, async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
      const { type, message } = req.body;
      const { data } = await service.CreateFeedback({ userId, type, message });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/feedback", UserAuth, async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
      const data = await service.FindFeedback({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/feedback", UserAuth, async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
      const { feedbackId } = req.body;
      const data = await service.DeleteFeedback({ feedbackId, userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};