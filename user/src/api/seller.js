const SellerService = require("../services/seller");
const { ValidateImage } = require("./validators");
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

  app.post("/seller/profile", upload.single('file'), ValidateImage, async (req, res, next) =>{
    try {
      const { company, badgeId, description, address1, address2, city, state, postalCode, country } = req.body;
      const logo = req.file;
      const { _id } = req.user;
      const userId = _id;
      const { data } = await service.CreateSellerProfile({ userId, company, logo, badgeId, description, address1, address2, city, state, postalCode, country });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  })

  app.put("/seller/update/:id", upload.single('file'),  ValidateImage, async (req, res, next) => {
    try {
      const userId = req.params.id;
      const data = { ...req.body };

      const logo = req.file;

      const { result } = await service.updatedSellerProfile({userId, data, logo});
      return res.json(result);
    } catch (error) {
      next(error);
    }
  })

  app.delete("/seller/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.DeleteUserAccount(_id);
      return res.json(data);
    } catch(error) {
      next(error);
    }
  })
};