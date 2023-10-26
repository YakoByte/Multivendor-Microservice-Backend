const httpProxy = require("http-proxy");
const gateway = httpProxy.createProxyServer();
const { ErrorHandler } = require("./utils/error-handler");

const userMicroservice = "http://localhost:5001";
const productMicroservice = "http://localhost:5002";
const orderMicroservice = "http://localhost:5003";
const transactionMicroservice = "http://localhost:5004";
const supportMicroservice = "http://localhost:5005";

const user = (req, res, next) => {
    try {
        gateway.web(req, res, { target: userMicroservice });
    } catch (error) {
        ErrorHandler.handleUserError(error, res);
    }
};

const product = (req, res, next) => {
    try {
        gateway.web(req, res, { target: productMicroservice });
    } catch (error) {
        ErrorHandler.handleProductError(error, req, res, next);
    }
};

const order = (req, res, next) => {
    try {
        gateway.web(req, res, { target: orderMicroservice });
    } catch (error) {
        ErrorHandler.handleOrderError(error, req, res, next);
    }
};

const transaction = (req, res, next) => {
    try {
        gateway.web(req, res, { target: transactionMicroservice });
    } catch (error) {
        ErrorHandler.handleTransactionError(error, req, res, next);
    }
};

const support = (req, res, next) => {
    try {
        gateway.web(req, res, { target: supportMicroservice });
    } catch (error) {
        ErrorHandler.handleSupportError(error, req, res, next);
    }
};

module.exports = {
  user,
  product,
  order,
  transaction,
  support,
};
