const {
    userModel,
    passwordModel,
    addressModel,
    historyModel,
  } = require("../models");
  const {
    APIError,
    STATUS_CODES,
  } = require("../../utils/app-error");
  
  
  class UserRepository {
    async CreateUser({ email, password, phoneNo }) {
      try {
        const findUser = await userModel.findOne({ email });
        if (findUser) {
          return findUser;
        }
  
        const isVerified = true;
  
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
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
      }
    }
  
    async FindUserById(userId) {
      try {
        const user = await userModel.findById(userId);
        if (!user) {
          throw new APIError("User not found", STATUS_CODES.NOT_FOUND, "User not found");
        }

        const password = await passwordModel.findOne({ userId });
    
        const userResult = { 
          userData: user,
          passwordSecurityData: password,
        };
    
        return userResult;
      } catch (error) {
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
      }
    }
  }
  
  module.exports = UserRepository;