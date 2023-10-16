const {
  userModel,
  passwordModel,
  addressModel,
  buyerModel,
  historyModel,
  couponModel,
} = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-error");

class BuyerRepository {
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
      "API Error", STATUS_CODES.INTERNAL_ERROR, "Unable to Create User";
    }
  }

  async CreateBuyer({userId, name, badgeId, genderId, phoneNo, email, addressId, isVerified}) {
    try {
      const buyer = new buyerModel({
        userId,
        name,
        logo,
        badgeId,
        genderId,
        contact: [{ phoneNo, email }],
        addressId,
        isVerified,
      });
      const buyerResult = await buyer.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: buyerResult._id,
          action: "profile created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return buyerResult;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }

  async CreateAddress({userId, address1, address2, city, state, postalCode, country}) {
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
            action: "password created",
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

  async CreateCoupon({userId, CouponId, name, constrait, description, offerType, amountOff}) {
    try {
      const findCoupon = await couponModel.find({ CouponId });
      if (findCoupon) {
        return findCoupon;
      }
      const coupon = new couponModel({
        userId,
        CouponId,
        name,
        constrait,
        description,
        offerType,
        amountOff,
      });
      const couponResult = await coupon.save();

      const history = await historyModel.findOne({ userId: userId });
      if (history) {
        history.log.push({
          objectId: couponResult._id,
          action: "coupon created",
          date: new Date().toISOString(),
          time: Date.now(),
        });
        await history.save();
      }

      return couponResult;
    } catch (error) {
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
      const user = await userModel.findById({ userId });
      const address = await addressModel.findOne({ userId });
      const profile = await buyerModel.findOne({ userId });
      const password = await passwordModel.findOne({ userId });

      const userResult = {
        profileDate: profile,
        passwordSecurityDate: password,
        addressData: address,
      };
      return {
        message: "user fetch successfully",
        status: STATUS_CODES.OK,
        userResult,
      };
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Error on Create Address"
      );
    }
  }
}

module.exports = BuyerRepository;
