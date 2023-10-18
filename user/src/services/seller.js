const { SellerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-error");

// All Business logic will be here
class SellerService {
  constructor() {
    this.repository = new SellerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingSeller = await this.repository.FindUser({ email });

      if (existingSeller) {
        const validPassword = await ValidatePassword(password, existingSeller.password);

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingSeller.email,
            _id: existingSeller._id,
          });

          return FormateData({ existingSeller, token });
        }
      }

      return FormateData(null);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async SignUp(userInputs) {
    const { email, password, phoneNo } = userInputs;
    try {
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const Seller = await this.repository.CreateUser({
        email,
        password: userPassword,
        phoneNo,
      });

      const token = await GenerateSignature({
        email: email,
        _id: Seller._id,
      });

      return FormateData({ Seller, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async AddNewAddress(userInputs) {
    const { userId, address1, address2, city, state, postalCode, country } =
      userInputs;

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
      const existingSeller = await this.repository.FindUserById(id);
      return FormateData(existingSeller);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = SellerService;