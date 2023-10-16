const httpProxy = require("http-proxy");
const gateway = httpProxy.createProxyServer();

const userMicroservice = "http://localhost:5001";
const productMicroservice = "http://localhost:5002";
const orderMicroservice = "http://localhost:5003";
const transactionMicroservice = "http://localhost:5004";
const supportMicroservice = "http://localhost:5005";

const user = (req, res) => {
    gateway.web(req, res, { target: userMicroservice });
};

const product = (req, res) => {
    gateway.web(req, res, { target: productMicroservice });
};

const order = (req, res) => {
    gateway.web(req, res, { target: orderMicroservice });
};

const transaction = (req, res) => {
    gateway.web(req, res, { target: transactionMicroservice });
};

const support = (req, res) => {
    gateway.web(req, res, { target: supportMicroservice });
};

module.exports = {
  user,
  product,
  order,
  transaction,
  support,
};
