const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  recipient: {
    name: { type: String, required: true, minLenght: 3, maxLenght: 55 },
    phone: { type: String, required: true, minLenght: 3, maxLenght: 55 },
    address: { type: String, required: true, minLenght: 3, maxLenght: 55 },
  },
  destination: {
    type: String,
    required: true,
    minLenght: 3,
    maxLenght: 55,
  },
  payement: {
    type: String,
    required: true,
    minLenght: 3,
    maxLenght: 55,
  },
  totalCost: {
    type: String,
    minLenght: 3,
    maxLenght: 55,
  },
  status: {
    type: Boolean,
    default: false,
  },
  invoiceStatus: {
    type: Boolean,
    default: false,
  },
  tracking: {
    type: String,
  },
  packs: { type: String, required: true },
  goods_price: { type: String, required: true },
  reception: { type: String, required: true },
  comments: { type: String, required: true },
  transport: { type: String, required: true },
  orderUrl: { type: String },
  delivery_day: { type: String },
  delivery_hours: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: {
    type: String,
  },
});

module.exports = mongoose.model("Order", orderSchema);
