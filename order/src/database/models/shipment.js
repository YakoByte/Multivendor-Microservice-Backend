const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Order',
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    pickUpAddressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Address'
    },
    CurrentAddress: [{
        city: {
            type: String,  
            required:true
        },
        state: {
            type: String,
        },
        countryCode: {
            type: String,
        }
    }],
    deliveryAddressId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Address'
    },
    estimateDate: {
        type: Date,
    }
  },
  { timestamps: true }
);

const Shipment = mongoose.model("Shipment", shipmentSchema);
module.exports = Shipment;
