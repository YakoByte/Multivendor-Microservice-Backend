const OtherService = require("../services/other");
const UserAdmin = require("./middlewares/admin");
const UserBuyer = require("./middlewares/buyer");

module.exports = (app) => {
  const service = new OtherService();

  app.post("/other/gender", UserAdmin, async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateGender({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/other/gender", UserAdmin, async(req, res, next) => {
    try{
      const { data } = await service.GetGender()
      return res.json(data)
      }catch(err){
        next(err)
      }
  });

  app.post("/other/badge", UserAdmin, async (req, res, next) => {
    try {
      const { name } = req.body;
      const { data } = await service.CreateBadge({ name });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/other/badge", UserAdmin, async(req, res, next) => {
    try{
      const { data } = await service.GetBadge()
      return res.json(data)
      }catch(err){
        next(err)
      }
  });

  app.post("/other/coupon", UserAdmin, async (req, res, next) => {
    try {
      const { userId, CouponId, name, constrait, description, offerType, amountOff } = req.body;
      const { data } = await service.CreateCoupon({ userId, CouponId, name, constrait, description, offerType, amountOff });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/other/coupon", UserAdmin, async(req, res, next) => {
    try{
      const { data } = await service.GetAllCoupon()
      return res.json(data)
      }catch(err){
        next(err)
      }
  });

  app.get("/other/coupon/one", UserBuyer, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const userId = _id;
      const { data } = await service.GetCoupon({userId})
      return res.json(data)
      }catch(err){
        next(err)
      }
  });
};