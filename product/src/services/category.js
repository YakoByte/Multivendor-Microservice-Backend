const { CategoryRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  async CreateCategory(userInputs) {
    const { name } = userInputs;
    try {
      const existingCategory = await this.repository.FindCategory({ name });
      if (existingCategory){
        return FormateData({ message: "Category already exist" })
      }

      const Category = await this.repository.CreateCategory({ name });

      return FormateData({ Category });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllCategory() {
    try {
      const Category = await this.repository.GetAllCategory();
      if (!Category){
        return FormateData({ message: "Category not found" })
      }
      return FormateData({ Category });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindCategory(userInputs) {
    const { name } = userInputs;
    try {
      const Category = await this.repository.FindCategory({ name });
      if (!Category){
        return FormateData({ message: "Category not found" })
      }
      return FormateData({ Category });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteCategory(userInputs) {
    const { name } = userInputs;
    try {
      const Category = await this.repository.DeleteCategory({ name });
      if (!Category){
        return FormateData({ message: "Category not found" })
      }
      return FormateData({ Category });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = CategoryService;