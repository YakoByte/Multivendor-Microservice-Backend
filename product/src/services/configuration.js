const { ConfigurationRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ConfigurationService {
  constructor() {
    this.repository = new ConfigurationRepository();
  }

  async CreateConfiguration(userInputs) {
    const { name, value } = userInputs;
    try {
      const existingConfiguration = await this.repository.FindConfiguration({ name });
      if (existingConfiguration){
        return FormateData({ message: "Configuration already exist" })
      }

      const Configuration = await this.repository.CreateConfiguration({ name, value });

      return FormateData({ Configuration });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllConfiguration() {
    try {
      const Configuration = await this.repository.GetAllConfiguration();
      if (!Configuration){
        return FormateData({ message: "Configuration not found" })
      }
      return FormateData({ Configuration });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async FindConfiguration(userInputs) {
    const { name } = userInputs;
    try {
      const Configuration = await this.repository.FindConfiguration({ name });
      if (!Configuration){
        return FormateData({ message: "Configuration not found" })
      }
      return FormateData({ Configuration });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async UpdateConfiguration(userInputs) {
    const { name, value } = userInputs;
    try {
      const Configuration = await this.repository.UpdateConfiguration({ name, value });
      if (!Configuration){
        return FormateData({ message: "Configuration not found" })
      }
      return FormateData({ Configuration });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async DeleteConfiguration(userInputs) {
    const { name } = userInputs;
    try {
      const Configuration = await this.repository.DeleteConfiguration({ name });
      if (!Configuration){
        return FormateData({ message: "Configuration not found" })
      }
      return FormateData({ Configuration });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }
}

module.exports = ConfigurationService;