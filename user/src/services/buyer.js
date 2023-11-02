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
      const Profile = await this.repository.CreateBuyer({ userId, name, badgeId, genderId });
      if (!Profile) {
        return FormateData({ message: "Buyer already exist" });
      }
      const Address = await this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });
      return FormateData({ Profile, Address });
    } catch (error) {
      throw new APIError("Buyer Profile Create failed", error);
    }
  }

  async GetBuyerProfile(userInputs) {
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

  async updatedBuyerProfile(userInputs) {
    try {
      const { userId, data } = userInputs;
      const updatedProfile = await this.repository.updateBuyer({ userId, data });
      if (!updatedProfile) {
        return FormateData({ message: "No buyer profile found with the provided id." });
      }
      return FormateData({ updatedProfile });
    }catch(error){
      throw new APIError('Buyer profile update failed', error);
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

  async DeleteBuyerAddress(userInputs) {
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

  async GetBuyerAddresses(userInputs) {
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

  async DeleteBuyerAccount(userInputs) {
    try {
      const { userId } = userInputs;
      const existingBuyer = await this.repository.DeleteUser({ userId });
      if (existingBuyer) {
        return FormateData({ message: "Deleted buyer Successfully" });
      }

      return FormateData({
        message: "error in deleting, buyer profile not founded",
      });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async GetBuyer(userInputs) {
    const { userId } = userInputs;
    try {
      const Profile = await this.repository.GetBuyer({userId});
      if (!Profile) {
        return FormateData({ message: "No Profile Found For This User." });
      }
        return FormateData({ Profile });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }
}

module.exports = BuyerService;