const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    State: {
        type:String,
        required :true
    },
    postalCode: {
        type: Number,
        minlength:6, 
        maxLength:6,
        required: true
    },
    country: {
        type: String,
        default: 'India'
    }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
