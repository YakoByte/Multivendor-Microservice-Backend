const BuyerService = require("../services/buyer");
const UserBuyer = require("./middlewares/buyer");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new BuyerService();

  app.post("/buyer/profile", UserAuth, async (req, res, next) =>{
    try {
      const { firstName, secondName, badgeId, genderId, address1, address2, city, state, postalCode, country } = req.body;
      const { _id } = req.user;
      const userId = _id;
      const name = firstName + ' ' + secondName;
      const { data } = await service.CreateBuyerProfile({ userId, name, badgeId, genderId, address1, address2, city, state, postalCode, country });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  })

  app.get("/buyer/profile", UserBuyer, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.GetBuyerProfile({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/buyer/profile", UserBuyer, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const data = { ...req.body };

      if (data.firstName || data.secondName) {
        const name = (data.firstName || "") + " " + (data.secondName || "");
        if (data.firstName) delete data.firstName;
        if (data.secondName) delete data.secondName;
        data.name = name;
      }

      const result = await service.updatedBuyerProfile({ userId, data });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/buyer/profile", UserBuyer, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { data } = await service.DeleteBuyerAccount({ userId });
      if(data){
        res.clearCookie('userToken');
      }
      return res.json(data);
    } catch(error) {
      next(error);
    }
  });

  app.post("/buyer/address", UserBuyer, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { address1, address2, city, state, postalCode, country } = req.body;

      const { data } = await service.AddNewAddress({userId, address1, address2, city, state, postalCode, country});

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/buyer/address/:id", UserBuyer, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const addressId = req.params.id;
      const { data } = await service.DeleteBuyerAddress({ userId, addressId });
      return res.json(data);
    }catch(error){
      next(error);
    }
  })

  app.get("/buyer/address", UserBuyer, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.GetBuyerAddresses({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  })
};