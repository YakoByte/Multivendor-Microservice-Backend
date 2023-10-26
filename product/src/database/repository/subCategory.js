const { subCategoryModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class SubCategoryRepository {
  async CreateSubCategory({ name }) {
    try {
      const SubCategory = new subCategoryModel({
        name: name,
      });
      const SubCategoryResult = await SubCategory.save();
      return SubCategoryResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message );
    }
  }

  async GetAllSubCategory() {
    try {
      const SubCategoryResult = await subCategoryModel.find();
      if (SubCategoryResult) {
        return SubCategoryResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindSubCategory({ name }) {
    try {
      const SubCategoryResult = await subCategoryModel.findOne({ name: name });
      if (SubCategoryResult) {
        return SubCategoryResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteSubCategory({ name }) {
    try {
      const SubCategoryResult = await subCategoryModel.findOneAndDelete({ name: name });
      if (SubCategoryResult) {
        return SubCategoryResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = SubCategoryRepository;