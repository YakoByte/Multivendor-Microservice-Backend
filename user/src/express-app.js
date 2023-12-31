const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { User } = require("./api");
const { Admin } = require("./api");
const { Other } = require("./api");
const { Buyer } = require("./api");
const { Seller } = require("./api");
const HandleErrors = require("./utils/error-handler");

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(cookieParser());
  app.use(express.static(__dirname + "/public"));

  //api
  User(app);
  Admin(app);
  Seller(app);
  Buyer(app);
  Other(app);

  // error handling
  app.use(HandleErrors);
};