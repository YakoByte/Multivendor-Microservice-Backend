const { SellerRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

class SellerService {
  constructor() {
    this.repository = new SellerRepository();
  }

  async CreateSellerProfile(userInputs) {
    try {
      const { userId, company, logo, badgeId, description, address1, address2, city, state, postalCode, country } = userInputs;
      const Profile = await this.repository.CreateSeller({ userId, company, logo, badgeId, description });
      if (!Profile) {
        return FormateData({ message: "Seller already exist" });
      }
      const address = await this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });
      return FormateData({ Profile, address });
    } catch (error) {
      throw new APIError("Seller Profile Create failed", error);
    }
  }

  async GetSellerProfile(userInputs) {
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

  async updatedSellerProfile(userInputs) {
    try {
      const { userId, data, logo } = userInputs;
      const updatedProfile = await this.repository.updateSeller({ userId, data, logo });
      if (!updatedProfile) {
        return FormateData({ message: "No seller profile found with the provided id." });
      }
      return FormateData({ updatedProfile });
    }catch(error){
      throw new APIError('Seller profile update failed', error);
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

  async DeleteSellerAddress(userInputs) {
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

  async GetSellerAddresses(userInputs) {
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

  async DeleteSellerAccount(userInputs) {
    try {
      const { userId } = userInputs;
      const existingSeller = await this.repository.DeleteUser({ userId });
      if (existingSeller) {
        return FormateData({ message: "Deleted seller Successfully" });
      }

      return FormateData({ message: "error in deleting, seller profile not founded" });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }
}

module.exports = SellerService;