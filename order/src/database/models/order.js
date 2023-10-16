const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customId: {
        type: String,
        required : true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    offerId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Offer'
    },
    couponId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    },
    totalPrice: {
        type:Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Packed", "Dispatched", "Delivered"],
        default:"Pending",
    },
    shipmentAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    paymentMethod: {
        type: String,
        enum:["COD", "Online"],
        default: "COD"
    },
    taxCalculation: [{
        name: {
            type: String,
            required:true,
        },
        type: {
            type:String, 
            required: true
        },
        tax: {
            type: Number,
            min: 0,
            default: 5
        },
    }],
    taxPdf: {
        type: String,
        required: true,
        default: "bit.ly/3NgVNGV",
    },
    billPdf: {
        type: String,
        required: true,
        default: "bit.ly/3NgVNGV",
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;