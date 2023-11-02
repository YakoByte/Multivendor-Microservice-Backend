const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
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
        enum: ["Pending", "Accepted", "Packed", "Dispatched", "Delivered", "Cancel"],
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
    billPdf: {
        type: String,
        default: "bit.ly/3NgVNGV",
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;