const WishlistService = require("../services/wishlist");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new WishlistService();

  app.post("/wishlist", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.CreateWishlist({ buyerId, productId });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/wishlist", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { data } = await service.GetWishlist({ buyerId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/wishlist", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.DeleteWishlist({ buyerId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};