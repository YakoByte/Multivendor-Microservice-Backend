const MessageService = require("../services/message");
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
  const service = new MessageService();

  app.post("/message", UserAuth, upload.single('file'), async (req, res, next) => {
    try {
      const { chatId, message } = req.body;
      const { _id } = req.user;
      const senderId = _id;
      Attachment = req.file;
      const { data } = await service.SendMessage({ senderId, chatId, message, Attachment });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/message/:chatId", UserAuth, async (req, res, next) => {
    try {
      const chatId = req.params.chatId;
      const data = await service.GetMessages({ chatId });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};