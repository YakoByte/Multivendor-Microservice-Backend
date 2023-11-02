const { chatModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class ChatRepository {
  async AccessChats({ buyerId, adminId }) {
    try {
      let chatExists = await chatModel
        .find({
          $and: [
            { users: { $elemMatch: { $eq: buyerId } } },
            { users: { $elemMatch: { $eq: adminId } } },
          ],
        })
        .populate("users", "-password")
        .populate("latestMessage");

      chatExists = await chatModel.populate(chatExists, {
        path: "latestMessage.sender",
        select: "name email profilePic",
      });

      if (chatExists.length > 0) {
        return chatExists[0];
      } else {
        let data = {
          users: [adminId, buyerId],
        };

        const newChat = await chatModel.create(data);

        const chat = await chatModel
          .find({ _id: newChat._id })
          .populate("users", "-password");

        return chat;
      }
    } catch (error) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FetchAllChats({ userId }) {
    try {
      const chats = await chatModel
        .find({
          users: { $elemMatch: { $eq: userId } },
        })
        .populate("users")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      const finalChats = await chatModel.populate(chats, {
        path: "latestMessage.sender",
        select: "name email profilePic",
      });

      return finalChats;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async AddToChat({ userId, chatId }) {
    try {
      const existing = await chatModel.findOne({ _id: chatId });

      if (!existing.users.includes(userId)) {
        const chat = await chatModel
          .findByIdAndUpdate(
            chatId,
            { $push: { users: userId } },
            { new: true }
          )
          .populate("groupAdmin", "-password")
          .populate("users", "-password");

        if (!chat) {
          return null;
        }

        return chat;
      } else {
        throw new Error("User is already a member of the group chat");
      }
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = ChatRepository;
