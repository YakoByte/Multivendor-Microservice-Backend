const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    productId: {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Product',
    },
    imagePath:{
        type : String,
        required: true,
        default: "bit.ly/3NgVNGV"
    },
    mimeType: {
        type : String,
        required : true,
        default: "image/jpeg"
    },
    imageSize: {
        type : Number,
        required : true,
        default: 0
    }
    },{timestamps: true});

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;