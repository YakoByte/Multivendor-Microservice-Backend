const OfferService = require("../services/offer");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new OfferService();

  app.post("/offer", UserAuth, async (req, res, next) => {
    try {
      const { productId, name, type, constrait, description, offerType, amountOff } = req.body;
      const { data } = await service.CreateOffer({ productId, name, type, constrait, description, offerType, amountOff });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/offer/product", UserAuth, async(req, res, next) => {
    try{
      const { productId } = req.body;
      const { data } = await service.GetOfferOnProduct({ productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/offer", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllOffer();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.put("/offer/:OfferId", UserAuth, async(req, res, next) => {
    try{
      const { OfferId } = req.params;
      const data = { ...req.body };
      const { result } = await service.UpdateOffer({ OfferId, data });
      return res.json(result);
      }catch(err){
        next(err)
      }
  });

  app.delete("/offer", UserAuth, async(req, res, next) => {
    try{
      const { offerId } = req.body;
      const { data } = await service.DeleteOffer({ offerId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};