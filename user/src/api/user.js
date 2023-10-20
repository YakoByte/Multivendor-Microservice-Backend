const UserService = require("../services/user");
const { ValidateEmail, ValidatePassword, ValidateNumber } = require("./validators");
const UserAuth = require("./middlewares/auth");

const IP = require('ip');
const axios = require('axios');
const os = require('os');

module.exports = (app) => {
  const service = new UserService();

  app.post("/signup", ValidateEmail, ValidatePassword, ValidateNumber, async (req, res, next) => {
    try {
      const { email, phoneNo, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.SignUp({ email, phoneNo, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/verify/:token", async (req, res, next) => {
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
      console.log(userIP);
      const ipLookUp = await axios.get(`http://ip-api.com/json/${userIP}`);
      const { IPdata } = ipLookUp;
      console.log(IPdata);
      const systemName = os.hostname();
      console.log('System Name:', systemName);

      const { email, password } = req.body;
      const { data } = await service.SignIn({ email, password });
      if(!data){
        return res.json("Invalid Email or Password")
      }
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/password/update", ValidateEmail, ValidatePassword, async (req, res, next) => {
    try {
      const { email, oldPassword, password, passwordQuestion, passwordAnswer } = req.body;
      const { data } = await service.updatePassword({ email, oldPassword, password, passwordQuestion, passwordAnswer });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/address", UserAuth, async (req, res, next) => {
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



// const response = await axios.get(`https://ipapi.co/${userIP}/json`);
// const locationData = response.data;
// console.log('User Location:', locationData);