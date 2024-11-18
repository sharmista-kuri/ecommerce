const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
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
  image: String
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
