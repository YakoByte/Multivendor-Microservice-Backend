const UserService = require("../services/user");
const { ValidateEmail, ValidatePassword, ValidateNumber } = require("./validators");
const UserAuth = require("./middlewares/auth");
const { parseUserAgent } = require("../utils")

const IP = require('ip');
const axios = require('axios');
const os = require('os');

module.exports = (app) => {
  const service = new UserService();

  app.post("/signup", ValidateEmail, ValidatePassword, ValidateNumber, async (req, res, next) => {
    try {
      const userIP = IP.address();
      const ipLookUp = await axios.get(`http://ip-api.com/json/${userIP}`);
      const { IPdata } = ipLookUp;
      const systemName = os.hostname();

      const userAgent = req.headers['user-agent'];
      const browserInfo = await parseUserAgent(userAgent);
      const OS = browserInfo.os; 
      const deviceType = browserInfo.deviceType;
      const browser = browserInfo.browser;

      const { email, phoneNo, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.SignUp({ email, phoneNo, password, passwordQuestion, passwordAnswer, userIP, IPdata, systemName, OS, deviceType, browser });
      res.cookie("userToken", data.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/verify/:token", async (req, res, next) => {
    try {
      const token = req.params.token;
      const { data } = await service.verifyUser({ token });
      return res.json(data);
    } catch (err) {
        next(err);
      }
  })

  app.post('/login', ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const userIP = IP.address();
      const ipLookUp = await axios.get(`http://ip-api.com/json/${userIP}`);
      const { IPdata } = ipLookUp;
      const systemName = os.hostname();

      const userAgent = req.headers['user-agent'];
      const browserInfo = await parseUserAgent(userAgent);
      const OS = browserInfo.os; 
      const deviceType = browserInfo.deviceType;
      const browser = browserInfo.browser;

      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password, userIP, IPdata, systemName, OS, deviceType, browser });
      res.cookie("userToken", data.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post('/logout', UserAuth, async(req, res, next) => {
    try {
      const userAgent = req.headers['user-agent'];
      const browserInfo = await parseUserAgent(userAgent);
      const OS = browserInfo.os; 
      const deviceType = browserInfo.deviceType;
      const browser = browserInfo.browser;

      const { _id } = req.user;
      const userId = _id;

      const { data } = await service.LogOut({userId, OS, browser, deviceType});
      res.clearCookie('userToken');
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.put("/password/update", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const { email, oldPassword, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.updatePassword({ email, oldPassword, password, passwordQuestion, passwordAnswer });
      res.cookie("userToken", data.token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/password/update/email", ValidateEmail, async (req, res, next) => {
    try {
        const { email } = req.body;
        const { data } = await service.updatePasswordByEmail({ email });
        return res.json(data);
    } catch (err) {
        next(err);
    }
  });

  app.post("/password/update/:email/:_id", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const email = req.params.email;
      const _id = req.params._id;
      const userId = _id;
      const { password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.updatePasswordByEmailLink({ email, userId, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/profile", UserAuth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile(_id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });
};