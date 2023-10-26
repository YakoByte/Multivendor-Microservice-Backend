const SubCategoryService = require("../services/subCategory");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new SubCategoryService();

  app.post("/subcategory", UserAuth, async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateSubCategory({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/subCategory", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllSubCategory();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/subCategory/one", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.FindSubCategory({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/subCategory", UserAuth, async(req, res, next) => {
    try{
      const { name } = req.body;
      const { data } = await service.DeleteSubCategory({ name });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};