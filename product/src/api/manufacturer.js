const ManufacturerService = require("../services/manufacture");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ManufacturerService();

  app.post("/manufacture", UserAuth, async (req, res, next) => {
    try {
      const { name, description, enstablisedAt } = req.body;
      const { data } = await service.CreateManufacturer({ name, description, enstablisedAt });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/manufacture/one", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.GetManufacturer({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/manufacture", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllManufacturer();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.put("/manufacture", UserAuth, async(req, res, next) => {
    try{
      const { ...data } = req.body
      const { result } = await service.UpdateManufacturer({ data });
      return res.json(result);
      }catch(err){
        next(err)
      }
  });

  app.delete("/manufacture", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.DeleteManufacturer({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};