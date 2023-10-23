const {
    userModel,
    passwordModel,
    historyModel,
    loginHistoryModel,
  } = require("../models");
const {
    APIError,
    STATUS_CODES,
  } = require("../../utils/app-error");
const { SECRET_KEY } = require("../../config/index");
  
  class UserRepository {
    async CreateUser({ email, password, phoneNo }) {
      try {
        const findUser = await userModel.findOne({ $or: [{ email: email }, { phoneNo: phoneNo }] });
        if (findUser) {
          return null;
        }
  
        const isVerified = false;
  
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
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
      }
    }

    async CreateLoginHistory({ userId, userIP, IPdata, systemName }) {
      try {
        let location = 'World';
        if (IPdata && IPdata.data && IPdata.data.location) {
            location = IPdata.data.location;
        }

        const existingLoginHistory = await loginHistoryModel.find({ userId: userId });

        if (existingLoginHistory.length < 3) {
            const LoginData = new loginHistoryModel({
                userId: userId,
                IPAddress: userIP,
                location: location,
                system: systemName,
                isLogedIn: true,
            });

            const LoginHistory = await LoginData.save();
            return LoginHistory;
        }

        return existingLoginHistory;
      } catch (error) {
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Create Login History");
      }
    }       
  
    async verifyUser({ token }) {
      try{
        let decodedToken = jwt.verify(token, SECRET_KEY);
        const updatedUser = await userModel.updateOne(
          { email: decodedToken.email },
          { $set: { isVerified: true } }
        );
  
        const history = await historyModel.findOne({ userId: decodedToken.userId });
        if (history) {
          history.log.push({
            objectId: decodedToken._id,
            action: "user Verified",
            date: new Date().toISOString(),
            time: Date.now(),
          });
          await history.save();
        }
  
        return updatedUser;
      }catch(error) {
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Verifing User");
      }
    }
  
    async CreatePassword({ userId, passwordQuestion, passwordAnswer }) {
      try {
        const checkExistingQuestionsAnswers = await passwordModel.findOne({userId: userId,});
        if (checkExistingQuestionsAnswers){
          return checkExistingQuestionsAnswers;
        }

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

    async LogOut({ userId, userIP, systemName }) {
      try {
          const updatedUser = await loginHistoryModel.findOneAndDelete({userId: userId, IPAddress: userIP, system: systemName});
          if (!updatedUser) {
              return false;
          }
  
          let history = await historyModel.findOne({ userId });
          if (history) {
              history.log.push({
                  objectId: updatedUser._id,
                  action: "Logout User",
                  date: new Date().toISOString(),
                  time: Date.now(),
              });
              await history.save();
          }
  
          return true;
        } catch (err) {
          console.log("Logout error", err);
          throw new APIError('API Error', STATUS_CODES.BAD_REQUEST, 'Failed To Log Out User');
        }
    }  
  
    async UpdatePassword({userId, password}) {
      try{
        const updatedUser = await userModel.findByIdAndUpdate(userId, { password: password }, { new: true });
  
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
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on validating password detail");
      }
    }
  
    async FindUser({ email }){
      try {
        const userResult = await userModel.findOne({ email });
        if(!userResult){
          return null;
        }
  
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