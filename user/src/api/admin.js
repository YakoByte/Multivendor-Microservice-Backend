const AdminService = require("../services/admin");
const { ValidateEmail, ValidatePassword, ValidateNumber } = require("./validators");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new AdminService();

  app.post("/admin/signup", ValidateEmail, ValidatePassword, ValidateNumber, async (req, res, next) => {
    try {
      const { email, phoneNo, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.SignUp({ email, phoneNo, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/admin/verify", async (req, res, next) => {
    try {
      const { email, isVerified } = req.body;
      const { data } = await service.verifyUser({ email, isVerified });
      return res.json(data);
      } catch (err) {
        next(err);
      }
  })

  app.post("/admin/login", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/admin/password/update", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const { email, oldPassword, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.updatePassword({ email, oldPassword, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/admin/profile", async (req, res, next) =>{
    try {
      const { firstName, secondName, gender, address1, address2, city, state, postalCode, country } = req.body;
      const { _id } = req.user;
      const userId = _id;
      const name = firstName + secondName;
      const { data } = await service.CreateAdminProfile({ userId, name, gender, address1, address2, city, state, postalCode, country });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  })
  
  app.put("/admin/update/:id", async (req, res, next) => {
    try {
      const userId = req.params.id;
      const data = { ...req.body };

      const { result } = await service.updatedAdminProfile({userId, data});
      return res.json(result);
    } catch (error) {
      next(error);
    }
  })

  app.post("/admin/address", UserAuth, async (req, res, next) => {
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

  app.get("/admin/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile(_id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/admin/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.DeleteUserAccount(_id);
      return res.json(data);
    } catch(error) {
      next(error);
    }
  })
};