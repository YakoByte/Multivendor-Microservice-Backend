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
      const name = firstName + secondName;
      const { data } = await service.CreateBuyerProfile({ userId, name, badgeId, genderId, address1, address2, city, state, postalCode, country });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  })

  app.put("/buyer/update/:id", UserBuyer, async (req, res, next) => {
    try {
      const userId = req.params.id;
      const data = { ...req.body };

      const { result } = await service.updatedBuyerProfile({userId, data});
      return res.json(result);
    } catch (error) {
      next(error);
    }
  })

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

  app.delete("/buyer/profile", UserBuyer, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.DeleteUserAccount(_id);
      return res.json(data);
    } catch(error) {
      next(error);
    }
  })
};