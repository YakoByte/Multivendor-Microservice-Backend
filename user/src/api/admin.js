const AdminService = require("../services/admin");
const UserAdmin = require("./middlewares/admin");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new AdminService();

  app.post("/admin/profile", UserAuth, async (req, res, next) => {
    try {
      const { firstName, secondName, gender, address1, address2, city, state, postalCode, country } = req.body;
      const { _id } = req.user;
      const userId = _id;
      const name = firstName + ' ' + secondName;
      const { data } = await service.CreateAdminProfile({ userId, name, gender, address1, address2, city, state, postalCode, country });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/admin/profile", UserAdmin, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.GetAdminProfile({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/admin/profile", UserAdmin, async (req, res, next) => {
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

      const result = await service.updatedAdminProfile({ userId, data });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/admin/profile", UserAdmin, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { data } = await service.DeleteUserAccount({ userId });
      if(data){
        res.clearCookie('userToken');
      }
      return res.json(data);
    } catch(error) {
      next(error);
    }
  })

  app.post("/admin/address", UserAdmin, async (req, res, next) => {
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

  app.delete("/admin/address/:id", UserAdmin, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const addressId = req.params.id;
      const { data } = await service.DeleteAdminAddress({ userId, addressId });
      return res.json(data);
    }catch(error){
      next(error);
    }
  })

  app.get("/admin/address", UserAdmin, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.GetAdminAddresses({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  })
};