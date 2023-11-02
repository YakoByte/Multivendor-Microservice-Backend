const { ReturnRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ReturnService {
  constructor() {
    this.repository = new ReturnRepository();
  }

  async CreateReturn(userInputs) {
    const { userId, orderId, productId, quantity, refundAmount, reason } = userInputs;
    try {
        const existingReturn = await this.repository.FindReturn({orderId});
        if (!existingReturn){
            return FormateData({ message: "Return already exist" })
        }

        const Return = await this.repository.CreateReturn({ userId, orderId, productId, quantity, refundAmount, reason });

        return FormateData({ Return });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindReturnOrder(userInputs) {
    try {
        const {orderId, userId} = userInputs;
        const Return = await this.repository.FindReturnOrder({orderId, userId});
        if(!Return) {
            return FormateData({ message: 'No Return exist' });
        }
        return FormateData({ Return });
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindReturn() {
    try {
        const Return = await this.repository.FindReturn();
        if(!Return) {
            return FormateData({ message: 'No Return exist' });
        }
        return FormateData({ Return });
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }

  async UpdateReturn(userInputs) {
    try {
        const { userId, orderId, status } = userInputs;
        const updatedReturn = await this.repository.UpdateReturn(userId, orderId, status);
        if (!updatedReturn) {
            return FormateData({ message: "Failed to update the Return" });
        }
        return FormateData({ updatedReturn });
    } catch (error) {
        throw new APIError("Data Not found", err);
    }
  }
}

module.exports = ReturnService;