const { offerModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class OfferRepository {
  async CreateOffer({ OfferId, productId, name, type, constrait, description, offerType, amountOff }) {
    try {
      const Offer = new offerModel({
        OfferId: OfferId,
        productId: productId,
        name: name,
        type: type,
        constrait: constrait,
        description: description,
        offerType: offerType,
        amountOff: amountOff,
      });
      const OfferResult = await Offer.save();
      return OfferResult;
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, error.message);
    }
  }

  async GetOffer({ OfferId }) {
    try {
      const OfferResult = await offerModel.findOne({ OfferId: OfferId});
      if(OfferResult){
        return OfferResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async updateOffer({ OfferId, data }) {
    try {
      const updateData = { ...data };
      if (updateData.OfferId) {
        delete updateData.OfferId;
      }
      const updatedOffer = await offerModel.findOneAndUpdate(
        { OfferId: OfferId },
        updateData,
        { new: true }
      );
  
      if (!updatedOffer) {
        throw new Error("Offer not found");
      }
  
      return updatedOffer;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetAllOffer() {
    try {
      const OfferResult = await offerModel.find();
      if (OfferResult) {
        return OfferResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetOfferOnProduct({ productId }) {
    try {
      const OfferResult = await offerModel.find({ productId: { $in: [productId] }});
      if (OfferResult) {
        return OfferResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteOffer({ OfferId }) {
    try {
      const Offer = await offerModel.findOneAndDelete({OfferId: OfferId});
      if (!Offer) {
        throw new Error("Offer not found");
      }
  
      return Offer;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = OfferRepository;