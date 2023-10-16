const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Process", "Successful", "Failed"],
      default: "Pending",
    },
    sourceAccount: {
      accountNumber: {
        type: String,
      },
      accountType: {
        type: String,
        enum: ["current", "savings"],
      },
    },
    destinationAccount: {
      accountNumber: {
        type: String,
      },
      accountType: {
        type: String,
        enum: ["current", "savings"],
      },
    },
    LocationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
