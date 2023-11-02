module.exports = {
    databaseConnection: require('./connection'),
    ChatRepository: require('./repository/chat'),
    MessageRepository: require('./repository/message'),
    NotificationRepository: require('./repository/notification'),
    FeedbackRepository: require('./repository/platformFeedback')
}