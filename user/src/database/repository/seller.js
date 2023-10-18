const {
  userModel,
  passwordModel,
  addressModel,
  sellerModel,
  historyModel,
} = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-error");

class SellerRepository {
  async CreateUser({ email, password, phoneNo }) {
    try {
      const findUser = await userModel.findOne({ email });
      if (findUser) {
        return findUser;
      }

      const user = new userModel({
        email: email,
        password: password,
        phoneNo: phoneNo,
      });
      const userResult = await user.save();

      const history = new historyModel({
        userId: userResult._id,
        log: [
          {
            objectId: userResult._id,
            action: "User created",
            date: new Date().toISOString(),
            time: Date.now(),
          },
        ],
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
          action: "password created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return passwordResult;
    } catch (error) {
      "API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Create Password";
    }
  }

  async CreateSeller({userId, company, logo, badgeId, phoneNo, email, description, addressId, isVerified}) {
    try {
      const seller = new sellerModel({
        userId,
        company,
        logo,
        badgeId,
        contact: [{ phoneNo, email }],
        description,
        addressId,
        isVerified,
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
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async CreateAddress({ userId, address1, address2, city, state, postalCode, country}) {
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
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
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

  async FindUserById({ userId }) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new APIError("User not found", STATUS_CODES.NOT_FOUND, "User not found");
      }

      const address = await addressModel.findOne({ userId });
      const profile = await sellerModel.findOne({ userId });
      const password = await passwordModel.findOne({ userId });

      const userResult = {
        userData: user,
        profileDate: profile,
        passwordSecurityDate: password,
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
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Address");
    }
  }
}

module.exports = SellerRepository;