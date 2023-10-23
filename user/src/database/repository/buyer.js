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
  async CreateBuyer({userId, name, badgeId, genderId, addressId}) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;
      const buyer = new buyerModel({
        userId: userId,
        name: name,
        badgeId: badgeId,
        genderId: genderId,
        contact: [{ phoneNo: phoneNo, email: email }],
        Address: addressId,
      });
      const buyerResult = await buyer.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: buyerResult._id,
          action: "profile created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return buyerResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }

  async updateBuyer({ userId, data }){
    try {
      const { datas } = data;
      const updatedBuyer = await buyerModel.findOneAndUpdate(
        { userId: userId },
        datas,
        { new: true }
      );
      if (!updatedBuyer){
        throw new APIError('API Error', STATUS_CODES.NOT_FOUND, 'Buyer profile not found');
      }

      return updatedBuyer;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }

  async CreateAddress({ userId, address1, address2, city, state, postalCode, country }) {
    try {
      const user = await userModel.findById(userId);

      if (user) {
        const Address = new addressModel({
          address1: address1,
          address2: address2,
          city: city,
          State: state,
          postalCode: postalCode,
          country: country,
        });
        const addressResult = await Address.save();

        const updateBuyer = await buyerModel.findOneAndUpdate(
          { userId },
          { $push: { Address: addressResult._id } },
          { new: true }
        );

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
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }

  async DeleteUser(userId){
    try{
      const user = await userModel.findByIdAndDelete(userId);
      const profile = await buyerModel.findOneAndDelete({ userId });
      for (const addr of profile.Address) {
        const addressData = await addressModel.findByIdAndDelete(addr);
      }
      const password = await passwordModel.findOneAndDelete({ userId });
      const history = await historyModel.findOneAndDelete({ userId });
      if(!user || !profile || !password || !history){
        throw new APIError('Deletion Failed', STATUS_CODES.BAD_REQUEST, 'Failed to delete the User');
      }
      return true;
    } catch(error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }
}

module.exports = BuyerRepository;