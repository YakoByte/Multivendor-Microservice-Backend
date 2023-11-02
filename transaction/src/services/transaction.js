const { TransactionRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class TransactionService {
  constructor() {
    this.repository = new TransactionRepository();
  }
}

module.exports = TransactionService;