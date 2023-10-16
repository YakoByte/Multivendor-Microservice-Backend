const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    address1: {
        type: String,
        require: true
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
    pinCode: {
        type: Number,
        minlength:6, 
        maxLength:6,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: India
    }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
