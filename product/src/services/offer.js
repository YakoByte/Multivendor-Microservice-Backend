const { OfferRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class OfferService {
  constructor() {
    this.repository = new OfferRepository();
  }

  async CreateOffer(userInputs) {
    const { productId, name, type, constrait, description, offerType, amountOff } = userInputs;
    const OfferId = name + '-' + type;
    try {
      const existingOffer = await this.repository.GetOffer({ OfferId });
      if (existingOffer){
        return FormateData({ message: "Offer already exist" });
      }

      const Offer = await this.repository.CreateOffer({ OfferId, productId, name, type, constrait, description, offerType, amountOff });
        return FormateData({ Offer });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOfferOnProduct(userInputs) {
    const { productId } = userInputs;
    try {
      const Offer = await this.repository.GetOfferOnProduct({ productId }) ;
      if (!Offer){
        return FormateData({ message: "Offer not found" })
      }
      return FormateData({ Offer });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllOffer() {
    try {
      const Offer = await this.repository.GetAllOffer();
      if (!Offer){
        return FormateData({ message: "Offer not found" })
      }
      return FormateData({ Offer });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async UpdateOffer(userInputs) {
    const { OfferId, data } = userInputs;
    try {
      const existingOffer = await this.repository.GetOffer({ OfferId });
      if (!existingOffer) {
        return FormateData({ message: 'Offer not found' });
      }

      const updatedOffer = await this.repository.updateOffer({ OfferId, data });
  
      return FormateData({ updatedOffer });
    } catch (error) {
      throw new APIError("Data Not Found", error.message);
    }
  }

  async DeleteOffer(userInputs) {
    const { offerId } = userInputs;
    try {
      const Offer = await this.repository.DeleteOffer({ offerId });
      return FormateData({ Offer });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }
}

module.exports = OfferService;