const { genderModel, badgeModel } = require("../models");
const { APIError, BadRequestError, STATUS_CODES } = require("../../utils/app-error");
  
class OtherRepository {
    async CreateGender({ name }) {
      try {
          const Gender = new genderModel({
            name
          });
          const GenderResult = await Gender.save();
          return {
            message: "address created successfully",
            status: STATUS_CODES.OK,
            GenderResult,
          };
      } catch (err) {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Error on Create Address"
        );
      }
    }

    async FindGender({ name }) {
      try {
        const GenderResult = await genderModel.findOne({name});
        if(GenderResult){
          return GenderResult;
        }
        return null;
      } catch (err) {
        throw new APIError(
          "API Error",
          STATUS_CODES.INTERNAL_ERROR,
          "Error on Create Address"
        );
      }
    }

    async CreateBadge({ name }) {
        try {
            const Badge = new badgeModel({
              name
            });
            const BadgeResult = await Badge.save();
            return {
              message: "address created successfully",
              status: STATUS_CODES.OK,
              BadgeResult,
            };
        } catch (err) {
          throw new APIError(
            "API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Error on Create Address"
          );
        }
      }

    async FindBadge({ name }) {
        try {
          const BadgeResult = await badgeModel.findOne({name});
          if(BadgeResult){
            return BadgeResult;
          }
          return null;
        } catch (err) {
          throw new APIError(
            "API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Error on Create Address"
          );
        }
      }
  }

  module.exports = OtherRepository;