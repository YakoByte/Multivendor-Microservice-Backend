const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    customId: {
        type : String,
        required : true,
    },
    userId: [{ 
        type: String, 
        required: true 
    }],
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ['sended', 'received', 'unread', 'read'],
        default:"sended"
    }
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;