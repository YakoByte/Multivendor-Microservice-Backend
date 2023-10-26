const { categoryModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class CategoryRepository {
  async CreateCategory({ name }) {
    try {
      const Category = new categoryModel({
        name: name,
      });
      const CategoryResult = await Category.save();
      return CategoryResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message );
    }
  }

  async GetAllCategory() {
    try {
      const CategoryResult = await categoryModel.find();
      if (CategoryResult) {
        return CategoryResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindCategory({ name }) {
    try {
      const CategoryResult = await categoryModel.findOne({ name: name });
      if (CategoryResult) {
        return CategoryResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteCategory({ name }) {
    try {
      const CategoryResult = await categoryModel.findOneAndDelete({ name: name });
      if (CategoryResult) {
        return CategoryResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = CategoryRepository;