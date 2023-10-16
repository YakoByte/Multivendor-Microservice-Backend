const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
    },
    refundAmount: {
        type :Number,
    },
    reason: {
        type: String,
        required: true
    },
    status:{
        type:String,
        enum: ['Pending', 'Approved','Rejected'],
        default:'Pending'   
    }
  },
  { timestamps: true }
);

const Return = mongoose.model("Return", returnSchema);
module.exports = Return;
