const {
  userModel,
  passwordModel,
  addressModel,
  adminModel,
  historyModel,
} = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-error");


class AdminRepository {
  async CreateUser({ email, password, phoneNo, isVerified }) {
    try {
      const findUser = await userModel.findOne({ email });
      if (findUser) {
        return findUser;
      }

      const user = new userModel({
        email: email,
        password: password,
        phoneNo: phoneNo,
        isVerified: isVerified,
      });
      const userResult = await user.save();

      const history = new historyModel({
        userId: userResult._id,
        log: [{
            objectId: userResult._id,
            action: "User created",
            date: new Date().toISOString(),
            time: Date.now(),
          }],
      });
      await history.save();

      return userResult;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create User"
      );
    }
  }

  async verifyUser({email, isVerified}) {
    try{
      const existingUser = await userModel.findOneAndUpdate({email}, {isVerified}, {new: true})
      if(!existingUser){
        throw new APIError("User not found", STATUS_CODES.NOT_FOUND, "Unable to verify");
      }

      const history = await historyModel.findOne({ userId });
      if (history) {
        history.log.push({
          objectId: existingUser._id,
          action: "user Verified",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return existingUser;
    }catch(error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Verifing User");
    }
  }

  async CreatePassword({ userId, passwordQuestion, passwordAnswer }) {
    try {
      const password = new passwordModel({
        userId: userId,
        passwordQuestion: passwordQuestion,
        passwordAnswer: passwordAnswer,
        history: [Date.now()],
      });
      const passwordResult = await password.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: passwordResult._id,
          action: "security password created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return passwordResult;
    } catch (error) {
      "API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Create Password Security";
    }
  }

  async UpdatePassword({userId, password}) {
    try{
      const updatedUser = await userModel.findByIdAndUpdate(userId, { password }, { new: true });

      if (!updatedUser) {
        throw new APIError("User not found", STATUS_CODES.NOT_FOUND, "Unable to update password");
      }

      const history = await historyModel.findOne({ userId });
      if (history) {
        history.log.push({
          objectId: updatedUser._id,
          action: "password Updated",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }
      return updatedUser;
    }catch(error){
      throw new APIError("Internal Server Error", STATUS_CODES.INTERNAL_ERROR, "Unable to update password");
    }
  }

  async UpdatePasswordDetails({ userId, passwordQuestion, passwordAnswer }) {
    try {
      const password = await passwordModel.findOneAndUpdate(
        { userId },
        {
          passwordQuestion,
          passwordAnswer,
          $push: { history: { date: Date.now() } }
        },
        { new: true }
      );
  
      if (!password) {
        throw new APIError("User not found", STATUS_CODES.NOT_FOUND, "Unable to update password details");
      }
  
      const history = await historyModel.findOne({ userId });
      if (history) {
        history.log.push({
          objectId: password._id,
          action: "security password Updated",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return password;
    } catch (error) {
      throw new APIError("Internal Server Error", STATUS_CODES.INTERNAL_ERROR, "Unable to update password details");
    }
  }

  async passwordDetailsCheck({userId, passwordQuestion, passwordAnswer}){
    try {
      let password = await passwordModel.findOne({ userId });
      if(!password){
        throw new APIError('No Password Found',STATUS_CODES.BAD_REQUEST,'Please provide a valid UserID');
      }else{
        if((password.passwordQuestion === passwordQuestion && password.passwordAnswer === passwordAnswer)){
          return password;
        }else{
          return null;
        }
      }
    }catch(err){
      console.log(err);
    }
  }

  async CreateAdmin({ userId, name, gender, addressId }) {
    try {
      const existingUser = await userModel.findById(userId);
      const phoneNo = existingUser.phoneNo;
      const email = existingUser.email;
      const admin = new adminModel({
        userId,
        name,
        gender,
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

  async CreateAddress({ userId, address1, address2, city, state, postalCode, country }) {
    try {
      const user = await userModel.findById(userId);

      if (user) {
        const Address = new addressModel({
          address1,
          address2,
          city,
          state,
          postalCode,
          country,
        });
        const addressResult = await Address.save();

        const updateUser = await userModel.findOneAndUpdate(
          { userId },
          { $push: { Address: addressResult._id } },
          { new: true }
        );

        const history = await historyModel.findOne({ userId: userId });
        if (history) {
          history.log.push({
            objectId: addressResult._id,
            action: "Admin Address created",
            date: new Date().toISOString(),
            time: Date.now(),
        });
          await history.save();
        }

        return addressResult;
      }
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async updateAdmin({ userId, ...body }){
    try {
      
    } catch (error) {
      throw new APIError("Internal Server Error", STATUS_CODES.INTERNAL_ERROR, "Unable to update admin details");
    }
  }

  async FindUser({ email }){
    try {
      const userResult = await userModel.findOne({ email });

      if(userResult){
        const history = await historyModel.findOne({ userId: userResult._id });
        if (history) {
          history.log.push({
            objectId: userResult._id,
            action: "User login",
            date: new Date().toISOString(),
            time: Date.now(),
          });
          await history.save();
        }
      }

      return userResult;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async FindUserById(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new APIError("User not found", STATUS_CODES.NOT_FOUND, "User not found");
      }

      const profile = await adminModel.findOne({ userId });
      const password = await passwordModel.findOne({ userId });
      const address = [];
      for (const addr of profile.Address) {
        const addressData = await addressModel.findById(addr);
        address.push(addressData);
      }
  
      const userResult = { 
        userData: user,
        profileData: profile,
        passwordSecurityData: password,
        addressData: address,
      };
  
      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: userId,
          action: "profile visited",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }
  
      return userResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
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