const express = require("express");
const cors = require("cors");
const HandleErrors = require("./utils/error-handler");
const { Chat } = require('./api');
const { Message } = require('./api');
const { Notification } = require('./api');
const { FeedBack } = require('./api');

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //api
  Chat(app);
  Message(app);
  Notification(app);
  FeedBack(app);

  // error handling
  app.use(HandleErrors);
};