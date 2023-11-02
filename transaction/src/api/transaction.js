const TransactionService = require("../services/transaction");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
  const service = new TransactionService();
};