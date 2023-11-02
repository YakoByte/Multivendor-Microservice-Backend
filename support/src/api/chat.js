const ChatService = require("../services/chat");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ChatService();

  app.post("/chat", UserAuth, async (req, res, next) => {
    try {
      const { adminId } = req.body;
      const { _id } = req.user;
      const buyerId = _id;
      const { data } = await service.AccessChats({ buyerId, adminId });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/chat", UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.FetchAllChats({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/chat", UserAuth, async (req, res, next) => {
    try {
      const { userId, chatId } = req.body;
      const result = await service.updatedAdminProfile({ userId, chatId });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  });
};