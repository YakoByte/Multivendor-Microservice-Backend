const CategoryService = require("../services/category");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CategoryService();

  app.post("/category", UserAuth, async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateCategory({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/Category", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllCategory();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/Category/one", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.FindCategory({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/Category", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.DeleteCategory({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};