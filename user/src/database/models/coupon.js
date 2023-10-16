const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    CouponId:{
        type : String,  
        required : true
    },
    name: {
        type:String,
        required : true
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

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;