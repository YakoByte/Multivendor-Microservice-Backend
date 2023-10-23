const { BuyerRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class BuyerService {
  constructor() {
    this.repository = new BuyerRepository();
  }

  async CreateBuyerProfile(userInputs) {
    try {
      const { userId, name, badgeId, genderId, address1, address2, city, state, postalCode, country } = userInputs;
      const address = this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });

      const addressId = address._id; 
      const Profile = this.repository.CreateBuyer({ userId, name, badgeId, genderId, addressId });
      return FormateData({ Profile, address });
    } catch (error) {
      throw new APIError("Buyer Profile Create failed", err);
    }
  }

  async updatedBuyerProfile(userInputs) {
    try {
      const { userId, data } = userInputs;
      const updatedProfile = this.repository.updateBuyer({ userId, data });
      return FormateData({ updatedProfile });
    }catch(error){
      throw new APIError('Buyer profile update failed', error);
    }
  }

  async DeleteUserAccount(id) {
    try {
      const existingBuyer = await this.repository.DeleteUser(id);
      if(existingBuyer) {
        return FormateData({ existingBuyer });
      }

      return 'error in deleting';
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async AddNewAddress(userInputs) {
    const { userId, address1, address2, city, state, postalCode, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({
        userId,
        address1,
        address2,
        city,
        state,
        postalCode,
        country,
      });
      return FormateData({ addressResult });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = BuyerService;