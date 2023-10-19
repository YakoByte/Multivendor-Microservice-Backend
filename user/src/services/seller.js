const { SellerRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class SellerService {
  constructor() {
    this.repository = new SellerRepository();
  }

  async CreateSellerProfile(userInputs) {
    try {
      const { userId, company, logo, badgeId, description, address1, address2, city, state, postalCode, country } = userInputs;
      const address = this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });

      const addressId = address._id; 
      const Profile = this.repository.CreateSeller({ userId, company, logo, badgeId, description, addressId });
      return FormateData(Profile, address);
    } catch (error) {
      throw new APIError("Seller Profile Create failed", err);
    }
  }

  async updatedSellerProfile(userInputs) {
    try {
      const { userId, data, logo } = userInputs;
      const updatedProfile = this.repository.updateSeller({ userId, data, logo });
      return FormateData(updatedProfile);
    }catch(error){
      throw new APIError('Seller profile update failed', error);
    }
  }

  async DeleteUserAccount(id) {
    try {
      const existingSeller = await this.repository.DeleteUser(id);
      if(existingSeller) {
        return FormateData(existingSeller, 'successfully deleted');
      }

      return 'error in deleting';
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }
}

module.exports = SellerService;