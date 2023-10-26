const { configurationModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ConfigurationRepository {
  async CreateConfiguration({ name, value }) {
    try {
      const Configuration = new configurationModel({
        name: name,
        value: value
      });
      const ConfigurationResult = await Configuration.save();
      return ConfigurationResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message );
    }
  }

  async GetAllConfiguration() {
    try {
      const ConfigurationResult = await configurationModel.find();
      if (ConfigurationResult) {
        return ConfigurationResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindConfiguration({ name }) {
    try {
      const ConfigurationResult = await configurationModel.findOne({ name: name });
      if (ConfigurationResult) {
        return ConfigurationResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateConfiguration({ name, value }) {
    try {
      const ConfigurationResult = await configurationModel.findOneAndUpdate({ name: name }, { value: value }, {new: true});
      if (ConfigurationResult) {
        return ConfigurationResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteConfiguration({ name }) {
    try {
      const ConfigurationResult = await configurationModel.findOneAndDelete({ name: name });
      if (ConfigurationResult) {
        return ConfigurationResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = ConfigurationRepository;