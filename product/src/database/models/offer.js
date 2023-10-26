const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    OfferId: {
        type: String,
        required: true,
    },
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    name: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require:true
    },
    constrait:{
        type:Number,
    },
    description: {
        type: String,
    },
    offerType: {
        type: String, // FIXED_AMOUNT or PERCENTAGE
    },
    amountOff: {
        type: Number,
    }
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;