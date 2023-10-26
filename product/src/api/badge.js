const BadgeService = require("../services/badge");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new BadgeService();

  app.post("/badge", UserAuth, async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateBadge({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/badge", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllBadge()
      return res.json(data)
      }catch(err){
        next(err)
      }
  });

  app.get("/badge/one", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.FindBadge({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/badge", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.DeleteBadge({ name });
      return res.json(data)
      }catch(err){
        next(err)
      }
  });
};