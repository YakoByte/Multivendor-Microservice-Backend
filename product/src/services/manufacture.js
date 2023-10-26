const { ManufacturerRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ManufacturerService {
  constructor() {
    this.repository = new ManufacturerRepository();
  }

  async CreateManufacturer(userInputs) {
    const { name, description, enstablisedAt } = userInputs;
    try {
      const existingManufacturer = await this.repository.GetOneManufacturer({ name });
      if (existingManufacturer){
        return FormateData({ message: "Manufacturer already exist" });
      }

      const Manufacturer = await this.repository.CreateManufacturer({ name, description, enstablisedAt });
        return FormateData({ Manufacturer });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetManufacturer(userInputs) {
    const { name } = userInputs;
    try {
      const Manufacturer = await this.repository.GetManufacturer({ name }) ;
      if (!Manufacturer){
        return FormateData({ message: "Manufacturer not found" })
      }
      return FormateData({ Manufacturer });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllManufacturer() {
    try {
      const Manufacturer = await this.repository.GetAllManufacturer();
      if (!Manufacturer){
        return FormateData({ message: "Manufacturer not found" })
      }
      return FormateData({ Manufacturer });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async UpdateManufacturer(userInputs) {
    const { data } = userInputs;
    const name = data.name;
    try {
      const Manufacturer = await this.repository.UpdateManufacturer({ name, data });
      if (!Manufacturer){
        return FormateData({ message: "Manufacturer not updated" })
      }
      return FormateData({ Manufacturer });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }

  async DeleteManufacturer(userInputs) {
    const { name } = userInputs;
    try {
      const Manufacturer = await this.repository.DeleteManufacturer({ name });
      if(!Manufacturer){
        return FormateData({message:"Manufacturer not Found"})
      }
      return FormateData({ Manufacturer });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }
}

module.exports = ManufacturerService;