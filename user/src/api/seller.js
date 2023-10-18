const SellerService = require("../services/seller");
const { ValidateEmail, ValidatePassword, ValidateNumber } = require("./validators");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new SellerService();

  app.post("/seller/signup", ValidateEmail, ValidatePassword, ValidateNumber, async (req, res, next) => {
    try {
      const { email, password, phoneNo } = req.body;
      const { data } = await service.SignUp({ email, password, phoneNo });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/seller/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/seller/address", UserAuth, async (req, res, next) => {
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

  app.get("/seller/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile(_id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};