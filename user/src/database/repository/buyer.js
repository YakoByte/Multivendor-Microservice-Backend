const {
  userModel,
  passwordModel,
  addressModel,
  buyerModel,
  historyModel,
} = require("../models");
const {
  APIError,
  STATUS_CODES,
} = require("../../utils/app-error");

class BuyerRepository {
  async CreateBuyer({userId, name, badgeId, genderId}) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;

      const existingBuyer = await buyerModel.findOne({userId: userId});
      if(existingBuyer){
        return false;
      }
      const buyer = new buyerModel({
        userId: userId,
        name: name,
        badgeId: badgeId,
        genderId: genderId,
        contact: [{ phoneNo: phoneNo, email: email }],
      });
      const buyerResult = await buyer.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: buyerResult._id,
          action: "Buyer profile created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return buyerResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async GetProfile ({userId}) {
    try{
      const buyerProfile = await buyerModel.find({ userId:userId });
      if(!buyerProfile){
        return null;
      }
      return buyerProfile;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async updateBuyer({ userId, data }){
    try {
      const datas = data;
      const updatedBuyer = await buyerModel.findOneAndUpdate(
        { userId: userId },
        datas,
        { new: true }
      );
      if (!updatedBuyer){
        return false;
      }

      return updatedBuyer;
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

  async DeleteUser({userId}){
    try{
      const user = await userModel.findOneAndDelete({_id: userId});
      const profile = await buyerModel.findOneAndDelete({ userId: userId });
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

  async GetBuyer ({userId}) {
    try{
      const Profile = await buyerModel.find({ userId:userId });
      if(!Profile){
        return null;
      }
      return Profile;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }
}

module.exports = BuyerRepository;