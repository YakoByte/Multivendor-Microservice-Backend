const { UserRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  EmailSend,
  passwordUpdateEmailSend,
} = require("../utils");
const { APIError } = require("../utils/app-error");

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignIn(userInputs) {
    const { email, password, userIP, IPdata, systemName, OS, deviceType, browser } = userInputs;
    try {
      const existingUser = await this.repository.FindUser({ email });
      if (existingUser) {
        const validPassword = await ValidatePassword(password, existingUser.password);

        if (validPassword) {
          const previousLoginHistory = await this.repository.CreateLoginHistory({userId: existingUser._id, userIP, IPdata, systemName, OS, deviceType, browser});
          if (previousLoginHistory.length >= 3) {
            return FormateData({
              message: "You can only login to 3 devices at a time",
              previousLoginHistory
            });
          }

          const token = await GenerateSignature({
            email: existingUser.email,
            _id: existingUser._id,
          });

          return FormateData({ existingUser, token });
        }
      }

      return FormateData({message: "Invalid Email or Password"});
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async SignUp(userInputs) {
    const { email, phoneNo, password, passwordQuestion, passwordAnswer, userIP, IPdata, systemName, OS, deviceType, browser } = userInputs;
    try {
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(password, salt);
      const User = await this.repository.CreateUser({
        email,
        password: userPassword,
        phoneNo,
      });
      if (!User) {
        return FormateData({ message: "User already exist" });
      }

      await this.repository.CreateLoginHistory({userId: User._id, userIP, IPdata, systemName, OS, deviceType, browser});

      const Password = await this.repository.CreatePassword({
        userId: User._id,
        passwordQuestion,
        passwordAnswer,
      });

      const token = await GenerateSignature({
        email: email,
        _id: User._id,
      });
      await EmailSend(email);

      return FormateData({  message: `A verification link has been sent to your registered mail id ${email}`, User, Password, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async LogOut(userInputs) {
    const { userId, OS, browser, deviceType } = userInputs;
    try {
      const logoutUser = await this.repository.LogOut({ userId, OS, browser, deviceType });
      if(!logoutUser){
        return FormateData({message:"Failed to logout"})
      }
      return FormateData({ message:"logout user.....!" });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async verifyUser(userInputs) {
    try {
      const { token } = userInputs;
      const existingUser = await this.repository.verifyUser({ token });
      if (!existingUser) {
        return FormateData(null);
      }
      return FormateData({ existingUser });
    } catch (error) {
      throw new APIError("Data Not found", err);
    }
  }

  async updatePassword(userInputs) {
    try {
      const { email, oldPassword, password, passwordQuestion, passwordAnswer } = userInputs;
      let salt = await GenerateSalt();
      let newPassword = await GeneratePassword(password, salt);
      const existingUser = await this.repository.FindUser({ email });
      if (!existingUser) {
        return FormateData({message: "email is not registered.....!"});
      }

      if (await ValidatePassword(oldPassword, existingUser.password)) {
        const token = await GenerateSignature({
          email: existingUser.email,
          _id: existingUser._id,
        });
        return FormateData({ existingUser, token });
      }

      if (await this.repository.passwordDetailsCheck({userId: existingUser._id, passwordQuestion, passwordAnswer})) {
        const updatedUser = await this.repository.UpdatePassword({userId: existingUser._id, password: newPassword});

        const token = await GenerateSignature({
          email: updatedUser.email,
          _id: updatedUser._id,
        });

        return FormateData({ updatedUser, token });
      }
      return FormateData({ message: "Invalid Security question and answer...!" });
    } catch (err) {
      throw new APIError("Password update failed", err);
    }
  }

  async updatePasswordByEmail(userInputs) {
    try {
      const { email } = userInputs;
      const existingUser = await this.repository.FindUser({ email });
      if(!existingUser){
        return FormateData({message: "email not registered.....!"});
      }
      const userId = existingUser._id.toString();

      let salt = await GenerateSalt();
      let sendEmail = await GeneratePassword(email, salt);
      let sendId = await GeneratePassword(userId, salt);
      await passwordUpdateEmailSend(email, sendEmail, sendId);

      return FormateData({ message: `A link has been sent to your registered mail id ${email}` });
    } catch (error) {
      throw new APIError("Password update failed", err);
    }
  }

  async updatePasswordByEmailLink(userInputs){
    try {
      const{userId, password, passwordQuestion, passwordAnswer} = userInputs;
      const updatedUser = await this.repository.UpdatePassword({userId, password});
      const updatedPassword = await this.repository.UpdatePasswordDetails({userId, passwordQuestion, passwordAnswer});
      return FormateData({updatedUser, updatedPassword});
    } catch (error) {
      throw new APIError("Password update failed", err);
    }
  }

  async GetProfile(id) {
    try {
      const existingUser = await this.repository.FindUserById(id);
      return FormateData({ existingUser });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindUserDetail(userInputs) {
    try {
      const { userId } = userInputs;
      const existingUser = await this.repository.FindUserDetail({userId});
      return FormateData({ existingUser });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = UserService;
