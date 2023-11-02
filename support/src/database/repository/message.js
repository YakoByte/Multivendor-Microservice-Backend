const { messageModel, chatModel, attachmentModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class MessageRepository {
  async SendMessage({ senderId, chatId, message, Attachment }) {
    try {
      let attachmentId = null;

      if (Attachment) {
        const { path: filePath, mimeType: mimeType, size: fileSize } = Attachment;
        const newAttachment = await attachmentModel.create({
          filePath: filePath,
          mimeType: mimeType,
          fileSize: fileSize,
        });
        attachmentId = newAttachment._id;
      }

      const msg = await messageModel.create({
        sender: senderId,
        message: message,
        chatId: chatId,
        attachmentId: attachmentId,
      });

      const populatedMsg = await msg
        .populate("sender", "name profilePic email")
        .populate({
          path: "chatId",
          select: "chatName isGroup users",
          model: "Chat",
          populate: {
            path: "users",
            select: "name email profilePic",
            model: "User",
          },
        })
        .execPopulate();

      await chatModel.findByIdAndUpdate(chatId, {
        latestMessage: populatedMsg,
      });

      return populatedMsg;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetMessages({ chatId }) {
    try {
      let messages = await messageModel
        .find({ chatId })
        .populate({
          path: "sender",
          model: "User",
          select: "name profilePic email",
        })
        .populate({
          path: "chatId",
          model: "Chat",
        });
  
      return messages;
    } catch (err) {
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = MessageRepository;
