const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    requestId: {
        type : String,
        required : true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    productId: {
        type:String,
        required:true
    },
    subject: {
        type:String,
        required: true
    },
    message: {
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ['opened', 'closed'],
        default: "closed",
    },
    attachment:{
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
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
