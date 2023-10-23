const {
  userModel,
  passwordModel,
  addressModel,
  adminModel,
  historyModel,
} = require("../models");
const {
  APIError,
  STATUS_CODES,
} = require("../../utils/app-error");

class AdminRepository {
  async CreateAdmin({ userId, name, gender }) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;

      const existingAdmin = await adminModel.findOne({userId: userId});
      if(existingAdmin){
        return false;
      }
      const admin = new adminModel({
        userId: userId,
        name: name,
        genderId: gender,
        contact: [{ phoneNo: phoneNo, email: email }],
      });
      const adminResult = await admin.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: adminResult._id,
          action: "Admin profile created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return adminResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async GetProfile ({userId}) {
    try{
      const adminProfile = await adminModel.find({ userId:userId });
      if(!adminProfile){
        return null;
      }
      return adminProfile;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async updateAdmin({ userId, data }){
    try {
      const datas = data;
      const updatedAdmin = await adminModel.findOneAndUpdate(
        { userId: userId },
        datas,
        { new: true }
      );
      if (!updatedAdmin){
        return null;
      }

      return updatedAdmin;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async CreateAddress({ userId, address1, address2, city, state, postalCode, country }) {
    try {
      const user = await userModel.findById(userId);
      
      if (user) {
        const newAddress = new addressModel({
          userId: userId,
          address1: address1,
          address2: address2,
          city: city,
          State: state,
          postalCode: postalCode,
          country: country,
        });
        const addressResult = await newAddress.save();

        const history = await historyModel.findOne({ userId });
        if (history) {
          history.log.push({
            objectId: addressResult._id,
            action: "Address created",
            date: new Date().toISOString(),
            time: Date.now(),
        });
          await history.save();
        }

        return addressResult;
      }
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async DeleteAddress({ userId, addressId }){
    try {
      const address = await addressModel.findOneAndDelete({userId: userId, _id: addressId});
      if(!address){
        return false;
      }
      return true;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async GetAddress({userId}) {
    try{
      const addresses = await addressModel.find({ userId:userId }).sort('-createdAt');
      if(!addresses){
        return null;
      }
      return addresses;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async DeleteUser({ userId }){
    try{
      const user = await userModel.findOneAndDelete({_id: userId});
      const profile = await adminModel.findOneAndDelete({ userId: userId });
      const address = await addressModel.deleteMany({ userId: userId });
      const password = await passwordModel.findOneAndDelete({ userId: userId });
      const history = await historyModel.findOneAndDelete({ userId: userId });
      if(!user || !profile || !address || !password || !history){
        return false;
      }
      return true;
    } catch(error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }
}

module.exports = AdminRepository;