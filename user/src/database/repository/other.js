const { genderModel, badgeModel, couponModel, historyModel } = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/app-error");

class OtherRepository {
  async CreateGender({ name }) {
    try {
      const Gender = new genderModel({
        name,
      });
      const GenderResult = await Gender.save();
      return GenderResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Gender");
    }
  }

  async GetAllGender() {
    try {
      const GenderResult = await genderModel.findOne();
      if (GenderResult) {
        return GenderResult;
      }
      return null;
    } catch (err) {
      throw new APIError( "API Error", STATUS_CODES.INTERNAL_ERROR, "Error on fetching gender");
    }
  }

  async CreateBadge({ name }) {
    try {
      const Badge = new badgeModel({
        name,
      });
      const BadgeResult = await Badge.save();
      return BadgeResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Badge" );
    }
  }

  async GetAllBadge({ name }) {
    try {
      const BadgeResult = await badgeModel.findOne({ name });
      if (BadgeResult) {
        return BadgeResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on fetching badge");
    }
  }

  async CreateCoupon({userId, CouponId, name, constrait, description, offerType, amountOff}) {
    try {
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
      return couponResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Coupon");
    }
  }

  async GetCoupon({ userId }) {
    try {
      const CouponResult = await couponModel.find({ userId });
      if (CouponResult) {
        return CouponResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on fetching coupon");
    }
  }

  async FindCoupon({ userId, CouponId }) {
    try {
      const CouponResult = await couponModel.find({ userId, CouponId });
      if (CouponResult) {
        return CouponResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on fetching coupon");
    }
  }
}

module.exports = OtherRepository;