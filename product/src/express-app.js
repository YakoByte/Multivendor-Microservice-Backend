const express = require("express");
const cors = require("cors");
const HandleErrors = require("./utils/error-handler");
const { Badge } = require("./api");
const { Cart } = require("./api");
const { Category } = require("./api");
const { Configuration } = require("./api");
const { Feedback } = require("./api");
const { Manufacturer } = require("./api");
const { Offer } = require("./api");
const { Product } = require("./api");
const { Rating } = require("./api");
const { Review } = require("./api");
const { SubCategory } = require("./api");
const { Wishlish } = require("./api");

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //api
  Badge(app)
  Cart(app)
  Category(app)
  Configuration(app)
  Feedback(app)
  Manufacturer(app)
  Offer(app)
  Product(app)
  Rating(app)
  Review(app)
  SubCategory(app)
  Wishlish(app)

  // error handling
  app.use(HandleErrors);
};