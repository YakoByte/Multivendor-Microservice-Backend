const UserService = require("../services/user");
const { ValidateEmail, ValidatePassword, ValidateNumber } = require("./validators");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new UserService();

  app.post("/user/signup", ValidateEmail, ValidatePassword, ValidateNumber, async (req, res, next) => {
    try {
      const { email, phoneNo, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.SignUp({ email, phoneNo, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/user/verify", async (req, res, next) => {
    try {
      const { email, isVerified } = req.body;
      const { data } = await service.verifyUser({ email, isVerified });
      return res.json(data);
      } catch (err) {
        next(err);
      }
  })

  app.post("/user/login", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/user/password/update", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const { email, oldPassword, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.updatePassword({ email, oldPassword, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/user/address", UserAuth, async (req, res, next) => {
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

  app.get("/user/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile(_id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};