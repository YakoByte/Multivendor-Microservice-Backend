const { BuyerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-error");

// All Business logic will be here
class BuyerService {
  constructor() {
    this.repository = new BuyerRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;
    try {
      const existingBuyer = await this.repository.FindUser({ email });

      if (existingBuyer) {
        const validPassword = await ValidatePassword(password, existingBuyer.password);

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingBuyer.email,
            _id: existingBuyer._id,
          });

          return FormateData({ existingBuyer, token });
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

      const Buyer = await this.repository.CreateUser({
        email,
        password: userPassword,
        phoneNo,
      });

      const token = await GenerateSignature({
        email: email,
        _id: Buyer._id,
      });

      return FormateData({ Buyer, token });
    } catch (err) {
      throw new APIError("Data Not found", err);
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
      const existingBuyer = await this.repository.FindUserById(id);
      return FormateData(existingBuyer);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = BuyerService;