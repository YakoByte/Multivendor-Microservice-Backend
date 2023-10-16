const mongoose = require('mongoose')

const attachmentSchema = new mongoose.Schema({
    filePath:{
        type : String,
        required: true,
        default: "bit.ly/3NgVNGV"
    },
    mimeType: {
        type : String,
        required : true,
        default: "image/jpeg"
    },
    fileSize: {
        type : Number,
        required : true,
        default: 0
    }
    },{timestamps: true});

const Attachment = mongoose.model("Attachment", attachmentSchema);
module.exports = Attachment;