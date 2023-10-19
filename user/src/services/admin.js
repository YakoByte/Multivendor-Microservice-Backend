const { AdminRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class AdminService {
  constructor() {
    this.repository = new AdminRepository();
  }

  async CreateAdminProfile(userInputs) {
    try {
      const { userId, name, gender, address1, address2, city, state, postalCode, country } = userInputs;
      const address = this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });

      const addressId = address._id; 
      const Profile = this.repository.CreateAdmin({ userId, name, gender, addressId });
      return FormateData(Profile, address);
    } catch (error) {
      throw new APIError("Admin Profile Create failed", err);
    }
  }

  async updatedAdminProfile(userInputs) {
    try {
      const { userId, data } = userInputs;
      const updatedProfile = this.repository.updateAdmin({ userId, data });
      return FormateData(updatedProfile);
    }catch(error){
      throw new APIError('Admin profile update failed', error);
    }
  }

  async DeleteUserAccount(id) {
    try {
      const existingAdmin = await this.repository.DeleteUser(id);
      if(existingAdmin) {
        return FormateData(existingAdmin, 'successfully deleted');
      }

      return 'error in deleting';
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }
}

module.exports = AdminService;