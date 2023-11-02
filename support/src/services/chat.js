const { ChatRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-error");

// All Business logic will be here
class ChatService {
  constructor() {
    this.repository = new ChatRepository();
  }

  async AccessChats(userInputs) {
    try {
      const {buyerId, adminId} = userInputs;
      const Chat = await this.repository.AccessChats({ buyerId, adminId });
      if (!Chat || !Array.isArray(Chat)) return FormateData({ message: 'No chat found'});
      return FormateData({ Chat });
    } catch (error) {
      throw new APIError("Accessing the chat failed", error);
    }
  }

  async FetchAllChats(userInputs) {
    try {
      const {userId} = userInputs;
      const Chat = await this.repository.FetchAllChats({ userId });
      if (!Chat || !Array.isArray(Chat)) return FormateData({ message: 'No chats found'});
      return FormateData({ Chat });
    } catch (error) {
      throw new APIError("Fetching the Chat failed", error);
    }
  }

  async AddToChat(userInputs) {
    try {
      const {userId, chatId} = userInputs;
      const Chat = await this.repository.AddToChat({ userId, chatId });
      if (!Chat || !Array.isArray(Chat)) return FormateData({ message: 'No user Added'});
      return FormateData({ Chat });
    } catch (error) {
      throw new APIError("Add to Chat failed", error);
    }
  }
}

module.exports = ChatService;