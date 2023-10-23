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
  async CreateSeller({userId, company, logo, badgeId, description, addressId}) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;

      const { path: imagePath, mimetype: mimeType, size: imageSize } = logo;

      const seller = new sellerModel({
        userId: userId,
        company: company,
        logo: { imagePath, mimeType, imageSize },
        badgeId: badgeId,
        description: description,
        contact: [{ phoneNo: phoneNo, email: email }],
        Address: addressId,
      });
      const sellerResult = await seller.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: sellerResult._id,
          action: "profile created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return sellerResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }

  async updateSeller({ userId, data, logo }){
    try {
      const { datas } = data;
      const { path: imagePath, mimetype: mimeType, size: imageSize } = logo;

      const updatedSeller = await Seller.findOneAndUpdate(
        { userId: userId },
        {
          datas,
          $set: {
            'logo.data': imagePath,
            'logo.mimeType': mimeType,
            'logo.imageSize': imageSize,
          }
        },
        { new: true }
      );
      if (!updatedSeller){
        throw new APIError('API Error', STATUS_CODES.NOT_FOUND, 'seller profile not found');
      }

      return updatedSeller;
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

        const updateSeller = await sellerModel.findOneAndUpdate(
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
      const profile = await sellerModel.findOneAndDelete({ userId });
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

module.exports = SellerRepository;