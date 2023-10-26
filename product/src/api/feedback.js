const FeedbackService = require("../services/feedback");
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
  const service = new FeedbackService();

  app.post("/feedback", UserAuth, upload.single('file'), async (req, res, next) => {
    try {
     const { _id } = req.user;
     const userId = _id;
      const { subject, productId, message } = req.body;
      const attachment = req.file;
      const { data } = await service.CreateFeedback({ userId, subject, productId, message, attachment });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/feedback/product", UserAuth, async(req, res, next) => {
    try{
      const { productId } = req.body;
      const { data } = await service.GetProductFeedback({ productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.get("/feedback", UserAuth, async(req, res, next) => {
    try{
      const { data } = await service.GetAllFeedback();
      return res.json(data);
      }catch(err){
        next(err)
      }
  });

  app.put("/feedback/:productId", UserAuth, upload.single('file'), async (req, res, next) => {
    try {
      const { _id } = req.user;
      const userId = _id;
      const { productId } = req.params;
      const data = { ...req.body };
      const attachment = req.file;
  
      const result = await service.UpdateFeedback({ userId, productId, data, attachment });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });  

  app.delete("/feedback", UserAuth, async(req, res, next) => {
    try{
      const { _id } = req.user;
      const userId = _id;
      const { productId } = req.body;
      const { data } = await service.DeleteFeedback({ userId, productId });
      return res.json(data);
      }catch(err){
        next(err)
      }
  });
};