const { OtherRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError, BadRequestError } = require("../utils/app-error");

// All Business logic will be here
class OtherService {
  constructor() {
    this.repository = new OtherRepository();
  }

  async CreateGender(userInputs) {
    const { name } = userInputs;
    try {
      const existingGender = await this.repository.FindGender({ name });
      if (existingGender){
        FormateData({ existingGender })
      }

      const Gender = await this.repository.CreateGender({
        name
      });

      return FormateData(Gender);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetGender() {
    try {
      let genders = await this.repository.GetAllGender();
      return FormateData(genders);
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }

  async CreateBadge(userInputs) {
    const { name } = userInputs;
    try {
      const existingBadge = await this.repository.FindBadge({ name });
      if (existingBadge){
        FormateData({ existingBadge })
      }

      const Badge = await this.repository.CreateBadge({
        name
      });

      return FormateData(Badge);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetBadge() {
    try {
      let badges = await this.repository.GetAllBadge();
      return FormateData(badges);
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }

  async CreateCoupon(userInputs) {
    const { userId, CouponId, name, constrait, description, offerType, amountOff } = userInputs;
    try {
      const existingCoupon = await this.repository.FindCoupon({ userId, CouponId });
      if (existingCoupon){
        return FormateData(existingCoupon, 'coupoun allready exist')
      }

      const Coupon = await this.repository.CreateCoupon({
        userId, 
        CouponId, 
        name, 
        constrait, 
        description, 
        offerType, 
        amountOff
      });
      return FormateData(Coupon, 'coupoun created')
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetCoupon(userInputs) {
    const { userId } = userInputs;
    try {
      let Coupon = await this.repository.GetCoupon({userId});
      return FormateData(Coupon);
    } catch(error) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = OtherService;