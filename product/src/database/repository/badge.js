const { badgeModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class BadgeRepository {
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
      const BadgeResult = await badgeModel.find();
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

  async DeleteBadge({ name }) {
    try {
      const badgeResult = await badgeModel.findOneAndDelete({ name: name });
      if (badgeResult) {
        return badgeResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = BadgeRepository;