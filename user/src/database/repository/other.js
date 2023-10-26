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
        name: name,
      });
      const GenderResult = await Gender.save();
      return GenderResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message );
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
      throw new APIError( "API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindGender({ name }) {
    try {
      const genderResult = await genderModel.findOne({ name: name });
      if (genderResult) {
        return genderResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async CreateBadge({ name }) {
    try {
      const Badge = new badgeModel({
        name: name,
      });
      const BadgeResult = await Badge.save();
      return BadgeResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message );
    }
  }

  async GetAllBadge() {
    try {
      const BadgeResult = await badgeModel.findOne();
      if (BadgeResult) {
        return BadgeResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindBadge({ name }) {
    try {
      const badgeResult = await badgeModel.findOne({ name: name });
      if (badgeResult) {
        return badgeResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async CreateCoupon({userId, CouponId, name, constrait, description, offerType, amountOff}) {
    try {
      const coupon = new couponModel({
        userId: userId,
        CouponId: CouponId,
        name: name,
        constrait: constrait,
        description: description,
        offerType: offerType,
        amountOff: amountOff,
      });
      const couponResult = await coupon.save();
      return couponResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, "Error on Create Coupon");
    }
  }

  async GetAllCoupon() {
    try {
      const CouponResult = await couponModel.find();
      if (CouponResult) {
        return CouponResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetCoupon({ userId }) {
    try {
      const CouponResult = await couponModel.find({ userId: userId });
      if (CouponResult) {
        return CouponResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindCoupon({ userId, CouponId }) {
    try {
      const CouponResult = await couponModel.findOne({ userId: userId, CouponId:CouponId });
      if (CouponResult) {
        return CouponResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = OtherRepository;