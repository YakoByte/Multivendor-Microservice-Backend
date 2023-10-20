const { UserRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  EmailSend,
} = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingUser = await this.repository.FindUser({ email });

      if (existingUser) {
        const validPassword = await ValidatePassword(password, existingUser.password);

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingUser.email,
            _id: existingUser._id,
          });

          return FormateData({ existingUser, token });
        }
      }

      return FormateData(null);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async SignUp(userInputs) {
    const { email, phoneNo, password, passwordQuestion, passwordAnswer } = userInputs;
    try {
      let salt = await GenerateSalt();
      let userPassword = await GeneratePassword(password, salt);
      const User = await this.repository.CreateUser({
        email,
        password: userPassword,
        phoneNo,
      });

      const Password = await this.repository.CreatePassword({
        userId: User._id,
        passwordQuestion,
        passwordAnswer
      })

      const token = await GenerateSignature({
        email: email,
        _id: User._id,
      });
      await EmailSend(email);

      return FormateData({ User, Password, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async verifyUser(userInputs) {
    try{
      const { token } = userInputs;
      const existingUser = await this.repository.verifyUser({ token });
      if (!existingUser) {
        return FormateData(null, 'User not verified');
      }
      return FormateData(existingUser);
    }catch(error){
      throw new APIError("Data Not found", err);
    }
  }

  async updatePassword(userInputs) {
    try {
      const { email, oldPassword, newPassword, passwordQuestion, passwordAnswer } = userInputs;
      const existingUser = await this.repository.FindUser({ email });
      if (!existingUser) {
        return FormateData(null, 'User not found');
      }

      if (await ValidatePassword(oldPassword, existingUser.password)) {
        const token = await GenerateSignature({
          email: existingUser.email,
          _id: existingUser._id,
        });
        return FormateData({ existingUser, token });
      } 
      
      if(await passwordDetailsCheck(existingUser._id, passwordQuestion, passwordAnswer)){
        const updatedUser = await this.repository.UpdatePassword(existingUser._id, newPassword);
        return FormateData(updatedUser, 'Password updated successfully');
      }
  
      const updatedUser = await this.repository.UpdatePassword(existingUser._id, newPassword);
      const updatedPassword = await this.repository.UpdatePasswordDetails({
        userId: existingUser._id,
        passwordQuestion,
        passwordAnswer
      });
      const token = await GenerateSignature({
        email: updatedUser.email,
        _id: updatedUser._id,
      });
      return FormateData({ updatedUser, updatedPassword, token });
    } catch (err) {
      throw new APIError("Password update failed", err);
    }
  }
  
  async AddNewAddress(userInputs) {
    const { userId, address1, address2, city, state, postalCode, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({
        userId,
        address1,
        address2,
        city,
        state,
        postalCode,
        country,
      });
      return FormateData(addressResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetProfile(id) {
    try {
      const existingUser = await this.repository.FindUserById(id);
      return FormateData(existingUser);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = UserService;
