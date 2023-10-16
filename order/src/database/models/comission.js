const mongoose = require("mongoose");

const comissionSchema = new mongoose.Schema(
  {
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status: {
        type: String,
        enum: ["pending", "Done"],
        default:"pending",
    },
  },
  { timestamps: true }
);

const Comission = mongoose.model("Comission", comissionSchema);
module.exports = Comission;
