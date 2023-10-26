const ReviewService = require("../services/review");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new ReviewService();

  app.post("/review", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const buyerId = _id;
      const { productId, review } = req.body;
      const { data } = await service.CreateReview({ buyerId, productId, review });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/review", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.BuyerReviewProduct({ buyerId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/review/product", UserAuth, async(req, res, next) => {
    try{
      const { productId } = req.body;
      const { data } = await service.FindReviewProduct({ productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/review/buyer", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { data } = await service.FindReviewBuyer({ buyerId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/review", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.DeleteReview({ buyerId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};