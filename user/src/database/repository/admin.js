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
  async CreateAdmin({ userId, name, genderId, addressId }) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;
      const admin = new adminModel({
        userId,
        name,
        genderId,
        contact: [{ phoneNo, email }],
        Address: addressId,
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
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }

  async updateAdmin({ userId, data }){
    try {
      const updatedAdmin = await adminModel.findOneAndUpdate(
        { userId },
        data,
        { new: true }
      );
      if (!updatedAdmin){
        throw new APIError('API Error', STATUS_CODES.NOT_FOUND, 'Admin profile not found');
      }

      return updatedAdmin;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }

  async DeleteUser(userId){
    try{
      const user = await userModel.findByIdAndDelete(userId);
      const profile = await adminModel.findOneAndDelete({ userId });
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

module.exports = AdminRepository;