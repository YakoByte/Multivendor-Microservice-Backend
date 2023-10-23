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
      const {userId, name, gender, address1, address2, city, state, postalCode, country} = userInputs;
      const Profile = await this.repository.CreateAdmin({ userId, name, gender });
      if (!Profile) {
        return FormateData({ message: "Admin already exist" });
      }
      const Address = await this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });
      return FormateData({ Profile, Address });
    } catch (error) {
      throw new APIError("Admin Profile Create failed", error);
    }
  }

  async GetAdminProfile(userInputs) {
    const { userId } = userInputs;
    try {
      const Profile = await this.repository.GetProfile({userId});
      if (!Profile) {
        return FormateData({ message: "No Profile Found For This User." });
      }
      const Addresses = await this.repository.GetAddress({userId});
      if (!Addresses) {
        return FormateData({ message: "No Addresses Found For This User." });
      }
        return FormateData({ Profile, Addresses });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async updatedAdminProfile(userInputs) {
    try {
      const { userId, data } = userInputs;
      const updatedProfile = await this.repository.updateAdmin({ userId, data });
      if (!updatedProfile) {
        return FormateData({ message: "No admin profile found with the provided id." });
      }
      return FormateData({ updatedProfile });
    } catch (error) {
      throw new APIError("Admin profile update failed", error);
    }
  }

  async AddNewAddress(userInputs) {
    const { userId, address1, address2, city, state, postalCode, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });
      return FormateData({ addressResult });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteAdminAddress(userInputs) {
    const { userId, addressId } = userInputs;
    try {
      const deleteStatus = await this.repository.DeleteAddress({userId, addressId});
      if (!deleteStatus) {
        return FormateData({message: "No Address Found With The Provided Id",});
      }
      return FormateData({ message: "Deleted address Successfully" });
    } catch (err) {
      throw new APIError("Failed To Delete Address", err);
    }
  }

  async GetAdminAddresses(userInputs) {
    const { userId } = userInputs;
    try {
      const addresses = await this.repository.GetAddress({userId});
      if (!addresses) {
        return FormateData({ message: "No Addresses Found For This User." });
      }
        return FormateData({ addresses });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async DeleteAdminAccount(userInputs) {
    try {
      const { userId } = userInputs;
      const existingAdmin = await this.repository.DeleteUser({ userId });
      if (existingAdmin) {
        return FormateData({ message: "Deleted admin Successfully" });
      }

      return FormateData({ message: "error in deleting, admin profile not founded" });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }
}

module.exports = AdminService;