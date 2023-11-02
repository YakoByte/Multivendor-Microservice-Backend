const httpProxy = require("http-proxy");
const gateway = httpProxy.createProxyServer();
const ErrorHandler = require("./utils/error-handler");

const userMicroservice = "http://localhost:5001";
const productMicroservice = "http://localhost:5002";
const orderMicroservice = "http://localhost:5003";
const transactionMicroservice = "http://localhost:5004";
const supportMicroservice = "http://localhost:5005";

const proxyRequest = (target, req, res, next) => {
  try {
    gateway.web(req, res, { target });
  } catch (error) {
    ErrorHandler(error, req, res, next);
  }
};

const user = (req, res, next) => {
  proxyRequest(userMicroservice, req, res, next);
};

const product = (req, res, next) => {
  proxyRequest(productMicroservice, req, res, next);
};

const order = (req, res, next) => {
  proxyRequest(orderMicroservice, req, res, next);
};

const transaction = (req, res, next) => {
  proxyRequest(transactionMicroservice, req, res, next);
};

const support = (req, res, next) => {
  proxyRequest(supportMicroservice, req, res, next);
};

module.exports = {
  user,
  product,
  order,
  transaction,
  support,
};