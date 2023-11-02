const { MessageRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class MessageService {
  constructor() {
    this.repository = new MessageRepository();
  }

  async SendMessage(userInputs) {
    try {
      const { senderId, chatId, message, Attachment } = userInputs;
      const Message = await this.repository.SendMessage({ senderId, chatId, message, Attachment });
      if (!Message || !Array.isArray(Message)) return FormateData({ message: 'No message sended'});
      return FormateData({ Message });
    } catch (error) {
      throw new APIError("Sending message failed", error);
    }
  }

  async GetMessages(userInputs) {
    try {
      const { chatId } = userInputs;
      const Message = await this.repository.GetMessages({ chatId });
      if (!Message || !Array.isArray(Message)) return FormateData({ message: 'No chat access'});
      return FormateData({ Message });
    } catch (error) {
      throw new APIError("Sending message failed", error);
    }
  }
}

module.exports = MessageService;