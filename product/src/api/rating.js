const RatingService = require("../services/rating");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new RatingService();

  app.post("/rating", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const buyerId = _id;
      const { productId, rating } = req.body;
      const { data } = await service.CreateRating({ buyerId, productId, rating });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/rating", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.BuyerRatingProduct({ buyerId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/rating/product", UserAuth, async(req, res, next) => {
    try{
      const { productId } = req.body;
      const { data } = await service.FindRatingProduct({ productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/rating/buyer", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { data } = await service.FindRatingBuyer({ buyerId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/rating", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.DeleteRating({ buyerId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};