const { FeedbackRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class FeedbackService {
  constructor() {
    this.repository = new FeedbackRepository();
  }

  async CreateFeedback(userInputs) {
    const { userId, subject, productId, message, attachment } = userInputs;
    try {
      const existingFeedback = await this.repository.GetOneFeedback({ userId, productId });
      if (existingFeedback){
        const data = {};
        data.subject = subject;
        data.message = message;
        data.attachment = attachment;
        const Feedback = await this.repository.UpdateFeedback({ userId, productId, data });
        return FormateData({ Feedback });
      }

      const Feedback = await this.repository.CreateFeedback({ userId, subject, productId, message, attachment });
        return FormateData({ Feedback });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetProductFeedback(userInputs) {
    const { productId } = userInputs;
    try {
      const Feedback = await this.repository.GetFeedback({ productId }) ;
      if (!Feedback){
        return FormateData({ message: "Feedback not found" })
      }
      return FormateData({ Feedback });
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetAllFeedback() {
    try {
      const Feedback = await this.repository.GetAllFeedback();
      if (!Feedback){
        return FormateData({ message: "Feedback not found" })
      }
      return FormateData({ Feedback });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }

  async UpdateFeedback(userInputs) {
    const { userId, productId, data, attachment } = userInputs;
    try {
      const Feedback = await this.repository.UpdateFeedback({ userId, productId, data, attachment });
      if (!Feedback) {
        return FormateData({ message: 'Feedback not updated' });
      }
      return FormateData({ Feedback });
    } catch (error) {
      throw new APIError("Data Not found", error);
    }
  }  

  async DeleteFeedback(userInputs) {
    const { userId, productId } = userInputs;
    try {
      const Feedback = await this.repository.DeleteFeedback({ userId, productId });
      if (!Feedback){
        return FormateData({ message: 'Feedback not Founded' });
      }
      return FormateData({ Feedback });
    } catch (error) {
        throw new APIError("Data Not found", error);
    }
  }
}

module.exports = FeedbackService;