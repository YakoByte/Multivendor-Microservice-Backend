const CartService = require("../services/cart");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new CartService();

  app.post("/cart", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const buyerId = _id;
      const { productId, quantity } = req.body;
      const { data } = await service.CreateCart({ buyerId, productId, quantity });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", UserAuth, async(req, res, next) => {
    try{
        const { _id } = req.user;
        const buyerId = _id;
      const { data } = await service.FindCart({ buyerId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.put("/cart", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId, quantity } = req.body;
      const { data } = await service.UpdateCart({ buyerId, productId, quantity });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/cart", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const buyerId = _id;
      const { productId } = req.body;
      const { data } = await service.DeleteCart({ buyerId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};