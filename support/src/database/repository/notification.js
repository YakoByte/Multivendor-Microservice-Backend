const { notificationModel } = require("../models");
const { APIError, STATUS_CODES } = require("../../utils/app-error");

class NotificationRepository {
  async CreateNotification({ userId, type, message }) {
    try {
      const customId = `${type} + - + ${Date.now()}`;

      const Notification = new notificationModel({
        customId: customId,
        user: [userId],
        type: type,
        message: message,
      });
      const NotificationResult = await Notification.save();

      return NotificationResult;
    } catch (err) {
        throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async FindNotification({ customId }) {
    try {
      const NotificationResult = await notificationModel.find({
        customId: customId,
      });
      if (!NotificationResult) {
        return null;
      }
      return Notification;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async GetNotification({ userId }) {
    try {
      const NotificationResult = await notificationModel.find({
        userId: userId,
      });
      if (!NotificationResult) {
        return null;
      }
      return Notification;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  async DeleteNotification({ customId }) {
    try {
      const NotificationResult = await notificationModel.findOneAndDelete({
        customId: customId,
      });
      if (!NotificationResult) {
        return null;
      }
      return NotificationResult;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }
}

module.exports = NotificationRepository;
