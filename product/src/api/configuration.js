const ConfigurationService = require("../services/configuration");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ConfigurationService();

  app.post("/configuration", UserAuth, async (req, res, next) => {
    try {
      const { name, value } = req.body;
      const { data } = await service.CreateConfiguration({ name, value });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/configuration", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllConfiguration();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/configuration/one", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.FindConfiguration({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.put("/configuration", UserAuth, async(req, res, next) => {
    try{
      const { name, value } = req.body;
      const { data } = await service.UpdateConfiguration({ name, value });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/configuration", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.DeleteConfiguration({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};