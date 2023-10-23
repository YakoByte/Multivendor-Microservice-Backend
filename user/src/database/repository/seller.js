const {
  userModel,
  passwordModel,
  addressModel,
  sellerModel,
  historyModel,
} = require("../models");
const {
  APIError,
  STATUS_CODES,
} = require("../../utils/app-error");

class SellerRepository {
  async CreateSeller({userId, company, logo, badgeId, description}) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;

      const existingSeller = await sellerModel.findOne({userId: userId});
      if(existingSeller){
        return false;
      }

      const { path: imagePath, mimetype: mimeType, size: imageSize } = logo;

      const seller = new sellerModel({
        userId: userId,
        company: company,
        logo: { imagePath, mimeType, imageSize },
        badgeId: badgeId,
        description: description,
        contact: [{ phoneNo: phoneNo, email: email }],
      });
      const sellerResult = await seller.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: sellerResult._id,
          action: "Seller profile created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return sellerResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async GetProfile ({userId}) {
    try{
      const sellerProfile = await sellerModel.find({ userId:userId });
      if(!sellerProfile){
        return null;
      }
      return sellerProfile;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async updateSeller({ userId, data, logo }){
    try {
      const datas = data;
      const { path: imagePath, mimetype: mimeType, size: imageSize } = logo;

      const updatedSeller = await sellerModel.findOneAndUpdate(
        { userId: userId },
        {
          datas,
          $set: {
            'logo.imagePath': imagePath,
            'logo.mimeType': mimeType,
            'logo.imageSize': imageSize,
          }
        },
        { new: true }
      );
      if (!updatedSeller){
        return false;
      }

      return updatedSeller;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async CreateAddress({ userId, address1, address2, city, state, postalCode, country }) {
    try {
      const user = await userModel.findById(userId);

      if (user) {
        const Address = new addressModel({
          userId: userId,
          address1: address1,
          address2: address2,
          city: city,
          State: state,
          postalCode: postalCode,
          country: country,
        });
        const addressResult = await Address.save();

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
      const profile = await sellerModel.findOneAndDelete({ userId: userId });
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

module.exports = SellerRepository;