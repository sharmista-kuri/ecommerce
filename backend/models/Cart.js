const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  image: String
});

module.exports = mongoose.model('Cart', CartSchema);
