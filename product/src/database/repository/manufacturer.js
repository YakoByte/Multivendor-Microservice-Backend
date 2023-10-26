const { manufacturerModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ManufacturerRepository {
  async CreateManufacturer({ name, description, enstablisedAt }) {
    try {
      const Manufacturer = new manufacturerModel({
        name: name,
        description: description,
        enstablisedAt: enstablisedAt
      });
      const ManufacturerResult = await Manufacturer.save();
      return ManufacturerResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async updateFeedback({ name, data }) {
    try {
      const updateData = { ...data };
      if (updateData.name) {
        delete updateData.name;
      }
      const updatedManufacturer = await Manufacturer.findOneAndUpdate(
        { name: name },
        updateData,
        { new: true }
      );
  
      if (!updatedManufacturer) {
        throw new Error("Manufacturer not found");
      }
  
      return updatedManufacturer;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetOneManufacturer({ name }) {
    try {
      const Manufacturer = await manufacturerModel.findOne({ name: name });
      if (Manufacturer) {
        return Manufacturer;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetAllManufacturer() {
    try {
      const ManufacturerResult = await manufacturerModel.find();
      if (ManufacturerResult) {
        return ManufacturerResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetManufacturer({ name }) {
    try {
      const ManufacturerResult = await manufacturerModel.findOne({ name: name });
      if (ManufacturerResult) {
        return ManufacturerResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteManufacturer({ name }) {
    try {
      const Manufacturer = await manufacturerModel.findOneAndDelete({ name: name });
      if (Manufacturer) {
        return Manufacturer;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = ManufacturerRepository;