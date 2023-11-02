const OrderService = require("../services/order");
const UserAuth = require("./middlewares/auth");
const axios = require("axios");

module.exports = (app) => {
  const service = new OrderService();

  app.post("/item", UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { productId, quantity, offerId, couponId, shipmentAddress, paymentMethod } = req.body;
      
      const headers = { Authorization: req.headers.authorization };
      const params = { productId };

      const productApiUrl  = "http://localhost:4000/product/item/bill";
      const ProductResponse = await axios.get(productApiUrl, { headers, params });
      const ProductData = ProductResponse.data.Product;

      const userApiUrl = 'http://localhost:4000/user/getprofile';
      const userResponse = await axios.get(userApiUrl, { headers });
      const UserData = userResponse.data.existingUser;

      const userProfileApiUrl = 'http://localhost:4000/user/buyer';
      const userProfileResponse = await axios.get(userProfileApiUrl, { headers });
      const UserProfileData = userProfileResponse.data.Profile;

      const result = await service.CreateOrder({ userId, UserData, UserProfileData, ProductData, productId, quantity, offerId, couponId, shipmentAddress, paymentMethod });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/item/one",UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { orderId } = req.body;

      const result = await service.GetOneOrder({ orderId, userId });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/item/user",UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;

      const result = await service.FindOrder({ userId });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/item",UserAuth, async (req, res, next) => {
    try {
      const result = await service.FindAllOrder();
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.put("/item",UserAuth, async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const { orderId, status } = req.body;
      const result = await service.UpdateOrder({ userId, orderId, status });
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });
};
