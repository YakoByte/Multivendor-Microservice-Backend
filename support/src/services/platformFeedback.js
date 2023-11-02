const { FeedbackRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class FeedbackService {
  constructor() {
    this.repository = new FeedbackRepository();
  }

  async CreateFeedback(userInputs){
    try {
      const { userId, type, message } = userInputs;
      const Feedback = await this.repository.CreateFeedback({ userId, type, message });
      if(!Feedback) {
        return FormateData({ message: 'No Feedback Sended'});
      }
      return FormateData({ Feedback });
    } catch (error) {
      throw new APIError("Feedback creation failed", error);
    }
  }

  async FindFeedback(userInputs){
    try {
      const { userId } = userInputs;
      const Feedback = await this.repository.FindFeedback({ userId });
      if(!Feedback) {
        return FormateData({ message: 'No Feedback Found'});
      }
      return FormateData({ Feedback });
    } catch (error) {
      throw new APIError("Feedback failed", error);
    }
  }

  async DeleteFeedback(userInputs){
    try {
      const { feedbackId, userId } = userInputs;
      const Feedback = await this.repository.DeleteFeedback({ feedbackId, userId });
      if(!Feedback) {
        return FormateData({ message: 'No Feedback Sended'});
      }
      return FormateData({ Feedback });
    } catch (error) {
      throw new APIError("Feedback creation failed", error);
    }
  }
}

module.exports = FeedbackService;