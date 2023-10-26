const { feedbackModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class FeedbackRepository {
  async CreateFeedback({ userId, subject, productId, message, attachment }) {
    try {
      const requestId = userId + '-' + productId;
      const { path: imagePath, mimetype: mimeType, size: imageSize } = attachment;
      const Feedback = new feedbackModel({
        requestId: requestId,
        userId: userId,
        subject: subject,
        productId: productId,
        message: message,
        attachment: { imagePath, mimeType, imageSize },
      });
      const FeedbackResult = await Feedback.save();
      return FeedbackResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async UpdateFeedback({ userId, productId, data, attachment }) {
    try {
      const updatedData = { ...data };
      const { path: imagePath, mimetype: mimeType, size: imageSize } = attachment;
  
      if ('userId' in updatedData) {
        delete updatedData.userId;
      }
      if ('productId' in updatedData) {
        delete updatedData.productId;
      }

      const updateObject = {
        ...updatedData,
        $set: {
          'attachment.imagePath': imagePath,
          'attachment.mimeType': mimeType,
          'attachment.imageSize': imageSize,
        }
      };

      const filter = { userId, productId };
      const options = { new: true };
      const feedbackResult = await ratingModel.findOneAndUpdate(filter, updateObject, options);
  
      return feedbackResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }  

  async GetOneFeedback({ userId, productId }) {
    try {
      const Feedback = await feedbackModel.findOne({ userId: userId, productId: productId });
      if (Feedback) {
        return Feedback;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetAllFeedback() {
    try {
      const FeedbackResult = await feedbackModel.find();
      if (FeedbackResult) {
        return FeedbackResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetFeedback({ productId }) {
    try {
      const FeedbackResult = await feedbackModel.find({ productId: productId });
      if (FeedbackResult) {
        return FeedbackResult;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteFeedback({ userId, productId }) {
    try {
      const Feedback = await feedbackModel.findOneAndDelete({ userId: userId, productId: productId });
      if (Feedback) {
        return Feedback;
      }
      return null;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = FeedbackRepository;