const { NotificationRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class NotificationService {
  constructor() {
    this.repository = new NotificationRepository();
  }

  async CreateNotification(userInputs){
    try {
      const { userId, type, message } = userInputs;
      const Notification = await this.repository.CreateNotification({ userId, type, message });
      if(!Notification) {
        return FormateData({ message: 'No Notification Sended'});
      }
      return FormateData({ Notification });
    } catch (error) {
      throw new APIError("Notification creation failed", error);
    }
  }

  async FindNotification(userInputs){
    try {
      const { customId } = userInputs;
      const Notification = await this.repository.FindNotification({ customId });
      if(!Notification) {
        return FormateData({ message: 'No Notification Founded'});
      }
      return FormateData({ Notification });
    } catch (error) {
      throw new APIError("Notification failed", error);
    }
  }

  async GetNotification(userInputs){
    try {
      const { userId } = userInputs;
      const Notification = await this.repository.GetNotification({ userId });
      if(!Notification) {
        return FormateData({ message: 'No Notification Founded'});
      }
      return FormateData({ Notification });
    } catch (error) {
      throw new APIError("Notification failed", error);
    }
  }

  async DeleteNotification(userInputs){
    try {
      const { customId } = userInputs;
      const Notification = await this.repository.DeleteNotification({ customId });
      if(!Notification) {
        return FormateData({ message: 'No Notification Founded'});
      }
      return FormateData({ Notification });
    } catch (error) {
      throw new APIError("Notification failed", error);
    }
  }
}

module.exports = NotificationService;