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
}

module.exports = OtherService;