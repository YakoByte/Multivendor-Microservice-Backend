const { SubCategoryRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class SubCategoryService {
  constructor() {
    this.repository = new SubCategoryRepository();
  }

  async CreateSubCategory(userInputs) {
    const { name } = userInputs;
    try {
      const existingSubCategory = await this.repository.FindSubCategory({ name });
      if (existingSubCategory){
        return FormateData({ message: "SubCategory already exist" })
      }

      const SubCategory = await this.repository.CreateSubCategory({ name });

      return FormateData({ SubCategory });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllSubCategory() {
    try {
      const SubCategory = await this.repository.GetAllSubCategory();
      if (!SubCategory){
        return FormateData({ message: "SubCategory not found" })
      }
      return FormateData({ SubCategory });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindSubCategory(userInputs) {
    const { name } = userInputs;
    try {
      const SubCategory = await this.repository.FindSubCategory({ name });
      if (!SubCategory){
        return FormateData({ message: "SubCategory not found" })
      }
      return FormateData({ SubCategory });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteSubCategory(userInputs) {
    const { name } = userInputs;
    try {
      const SubCategory = await this.repository.DeleteSubCategory({ name });
      if (!SubCategory){
        return FormateData({ message: "SubCategory not found" })
      }
      return FormateData({ SubCategory });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = SubCategoryService;