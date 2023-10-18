const { AdminRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-error");

// All Business logic will be here
class AdminService {
  constructor() {
    this.repository = new AdminRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingAdmin = await this.repository.FindUser({ email });

      if (existingAdmin) {
        const validPassword = await ValidatePassword(password, existingAdmin.password);

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingAdmin.email,
            _id: existingAdmin._id,
          });

          return FormateData({ existingAdmin, token });
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
      const Admin = await this.repository.CreateUser({
        email,
        password: userPassword,
        phoneNo,
      });

      const Password = await this.repository.CreatePassword({
        _userId: Admin._id,
        passwordQuestion,
        passwordAnswer
      })

      const token = await GenerateSignature({
        email: email,
        _id: Admin._id,
      });

      return FormateData({ Admin, Password, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async verifyUser(userInputs) {
    try{
      const { email, isVerified } = userInputs;
      const existingUser = await this.repository.verifyUser({email, isVerified});
      if (!existingUser){
        return FormateData(null, 'User not verify');
      }
      return FormateData(existingUser);
    }catch(error){
      throw new APIError("Data Not found", err);
    }
  }

  async updatePassword(userInputs) {
    try {
      const { email, oldPassword, newPassword, passwordQuestion, passwordAnswer } = userInputs;
      const existingAdmin = await this.repository.FindUser({ email });
      if (!existingAdmin) {
        return FormateData(null, 'User not found');
      }
      if (await ValidatePassword(oldPassword, existingAdmin.password)) {
        const token = await GenerateSignature({
          email: existingAdmin.email,
          _id: existingAdmin._id,
        });
        return FormateData({ existingAdmin, token });
      }
      if(!await passwordDetailsCheck(existingAdmin._id, passwordQuestion, passwordAnswer)){
        const updatedAdmin = await this.repository.UpdatePassword(existingAdmin._id, newPassword);
        return FormateData(updatedAdmin, 'Password updated successfully');
      }
  
      const updatedAdmin = await this.repository.UpdatePassword(existingAdmin._id, newPassword);
      const updatedPassword = await this.repository.UpdatePasswordDetails({
        userId: existingAdmin._id,
        passwordQuestion,
        passwordAnswer
      });
      const token = await GenerateSignature({
        email: updatedAdmin.email,
        _id: updatedAdmin._id,
      });
      return FormateData({ updatedAdmin, updatedPassword, token });
    } catch (err) {
      throw new APIError("Password update failed", err);
    }
  }

  async CreateAdminProfile(userInputs) {
    try {
      const { userId, name, gender, address1, address2, city, state, postalCode, country } = userInputs;
      const address = this.repository.CreateAddress({ userId, address1, address2, city, state, postalCode, country });

      const addressId = address._id; 
      const Profile = this.repository.CreateAdmin({ userId, name, gender, addressId });
      return FormateData(Profile, address);
    } catch (error) {
      throw new APIError("Admin Profile Create failed", err);
    }
  }

  async updatedAdminProfile(userInputs) {
    try {
      const { userId, data } = userInputs;
      const updatedProfile = this.repository.updateAdmin({ userId, data });
      return FormateData(updatedProfile);
    }catch(error){
      throw new APIError('Admin profile update failed', error);
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
      const existingAdmin = await this.repository.FindUserById(id);
      return FormateData(existingAdmin);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteUserAccount(id) {
    try {
      const existingAdmin = await this.repository.DeleteUser(id);
      if(existingAdmin) {
        return FormateData(existingAdmin, 'successfully deleted');
      }

      return 'error in deleting';
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }
}

module.exports = AdminService;
