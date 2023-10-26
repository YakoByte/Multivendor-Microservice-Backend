const { BadgeRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class BadgeService {
  constructor() {
    this.repository = new BadgeRepository();
  }

  async CreateBadge(userInputs) {
    const { name } = userInputs;
    try {
      const existingBadge = await this.repository.FindBadge({ name });
      if (!existingBadge){
        return FormateData({ message: "Badge already exist" })
      }

      const Badge = await this.repository.CreateBadge({ name });

      return FormateData({ Badge });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllBadge() {
    try {
      const Badge = await this.repository.GetAllBadge();
      if(!Badge){
        return FormateData({message:"No badges Found"})
      }
      return FormateData({ Badge });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindBadge(userInputs) {
    const { name } = userInputs;
    try {
      const Badge = await this.repository.FindBadge({ name });
      if (!Badge){
        return FormateData({ message: "Badge not found" })
      }
      return FormateData({ Badge });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteBadge(userInputs) {
    const { name } = userInputs;
    try {
      const Badge = await this.repository.DeleteBadge({ name });
      if (!Badge){
        return FormateData({ message: "Badge not found" })
      }
      return FormateData({ Badge });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = BadgeService;