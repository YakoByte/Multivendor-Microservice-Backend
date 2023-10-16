const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    customId:{
        type: String,
        required: true,
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: false
    },
    Specification:[{
        "key": "value",
        default: []
    }],
    price: {
        type : Number,
        required :true,
    },
    sellerDiscount: {
        type : Number,
    },
    adminDiscount: {
        type :Number,
    },
    finalPrice: {
        type : Number,
    },
    stock: {
        type: Number,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
    },
    configurationId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Configuration'
    }],
    badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    },
    sellerId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    manufacturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Manufacturer'
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAvailable: {
        type:Boolean,
        default: true
    }
},
  {timestamps: true,}
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
