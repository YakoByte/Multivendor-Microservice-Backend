const SellerService = require("../services/seller");
const { ValidateImage } = require("./validators");
const UserSeller = require("./middlewares/seller");
const UserAuth = require("./middlewares/auth");

var multer = require("multer");
var storage = multer.diskStorage({
  destination:(req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' +file.originalname);
  }
})
const upload = multer({ storage: storage });

module.exports = (app) => {
  const service = new SellerService();

  app.post("/seller/profile", UserAuth, upload.single('file'), ValidateImage, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { company, badgeId, description, address1, address2, city, state, postalCode, country } = req.body;
      const logo = req.file;
      const { data } = await service.CreateSellerProfile({ userId, company, logo, badgeId, description, address1, address2, city, state, postalCode, country });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/seller/profile", UserSeller, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.GetSellerProfile({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/seller/profile", UserSeller, upload.single('file'), async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const data = { ...req.body };
      const logo = req.file;

      const result = await service.updatedSellerProfile({ userId, data, logo });
      return res.json(result);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/seller/profile", UserSeller, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { data } = await service.DeleteSellerAccount({ userId });
      if(data){
        res.clearCookie('userToken');
      }
      return res.json(data);
    } catch(error) {
      next(error);
    }
  });

  app.post("/seller/address", UserSeller, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { address1, address2, city, state, postalCode, country } = req.body;

      const { data } = await service.AddNewAddress({userId, address1, address2, city, state, postalCode, country});

      return res.json(data);
    } catch (err) {
      next(err);
    }
  })

  app.delete("/seller/address/:id", UserSeller, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const addressId = req.params.id;
      const { data } = await service.DeleteSellerAddress({ userId, addressId });
      return res.json(data);
    }catch(error){
      next(error);
    }
  })

  app.get("/seller/address", UserSeller, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { data } = await service.GetSellerAddresses({ userId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  })
};