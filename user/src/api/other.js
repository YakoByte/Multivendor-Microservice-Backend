const OtherService = require("../services/other");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new OtherService();

  app.post("/other/gender", async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateGender({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/other/gender", async(req, res, next) => {
    try{
      const { data } = await service.GetGender()
      return res.json(data)
      }catch(err){
        next(err)
      }
  });

  app.post("/other/badge", async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateBadge({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/other/badge", async(req, res, next) => {
    try{
      const { data } = await service.GetBadge()
      return res.json(data)
      }catch(err){
        next(err)
      }
  });

  app.post("/other/coupon", async (req, res, next) => {
    try {
      const { userId, CouponId, name, constrait, description, offerType, amountOff } = req.body;
      const { data } = await service.CreateCoupon({ userId, CouponId, name, constrait, description, offerType, amountOff });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/other/coupon", async(req, res, next) => {
    try{
      const { data } = await service.GetCoupon({userId})
      return res.json(data)
      }catch(err){
        next(err)
      }
  });
};