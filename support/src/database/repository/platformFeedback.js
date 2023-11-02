const { platFormFeedbackModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class FeedbackRepository {
  async CreateFeedback({ userId, type, message }) {
    try {
      const Feedback = new platFormFeedbackModel({
        user: userId,
        type: type,
        message: message,
      });
      const FeedbackResult = await Feedback.save();

      return FeedbackResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindFeedback({ userId }) {
    try {
      const FeedbackResult = await platFormFeedbackModel.find({ userId: userId });
      if (!FeedbackResult) {
        return null;
      }
      return FeedbackResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteFeedback({ feedbackId, userId }) {
    try {
      const FeedbackResult = await platFormFeedbackModel.findOneAndDelete({ _id: feedbackId, userId: userId });
      if (!FeedbackResult) {
        return null;
      }
      return FeedbackResult;
    } catch (error) {
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = FeedbackRepository;