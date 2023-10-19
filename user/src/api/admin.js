const AdminService = require("../services/admin");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new AdminService();

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