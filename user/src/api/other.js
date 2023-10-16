const OtherService = require("../services/other");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new OtherService();

  app.post("/other/gender", async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateGender({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/other/badge", async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateBadge({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};