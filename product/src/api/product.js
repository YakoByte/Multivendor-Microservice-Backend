const ProductService = require("../services/product");
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
  const service = new ProductService();

  app.post("/item", UserAuth, upload.array('files'), async (req, res, next) => {
    try {
      const { _id } = req.user;
      const sellerId = _id;
      const { name, description, Specification, price, sellerDiscount, adminDiscount, stock, categoryId, subCategoryId, configurationId, badgeId, manufacturerId, offerId } = req.body;
      const Images = req.files;
      const { data } = await service.CreateProduct({ name, description, Specification, price, sellerDiscount, adminDiscount, stock, categoryId, subCategoryId, configurationId, badgeId, sellerId, manufacturerId, offerId, Images });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/item/:productId", UserAuth, upload.array('files'), async(req, res, next) => {
    try{
      const { _id } = req.user;
      const sellerId = _id;
      const { productId } = req.params;
      const data = { ...req.body };
      const Images = req.files;
      const { result } = await service.updateProduct({ sellerId, productId, data, Images });
      return res.json(result);
      }catch(err){
        next(err)
      }
  });

  app.get("/item", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.FindAllProduct();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/item/one", UserAuth, async(req, res, next) => {
    try{
      const { productId } = req.body;
      const { data } = await service.FindProduct({ productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/item/query", UserAuth, async(req, res, next) => {
    try{
        const { Specification, categoryId, subCategoryId, configurationId, UpperPrice, LowerPrice, badgeId, manufacturerId } = req.query;
        const { data } = await service.FindKeyProduct({ Specification, categoryId, subCategoryId, configurationId, UpperPrice, LowerPrice, badgeId, manufacturerId });
        return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.delete("/item", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const sellerId = _id;
      const { productId } = req.body;
      const { data } = await service.DeleteProduct({ sellerId, productId });
      return res.json(data);
    }catch(err){
      next(err)
    }
  });

  app.delete("/image", UserAuth, async(req, res, next) => {
    try{
      const { ImageId } = req.body;
      const { data } = await service.DeleteOneImage({ ImageId });
      return res.json(data);
    }catch(err){
      next(err)
    }
  });

  app.get("/item/bill", UserAuth, async(req, res, next) => {
    try{
      const { productId } = req.query;
      const { data } = await service.FindProductBill({ productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};