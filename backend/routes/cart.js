const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/Cart'); 
const authenticateToken = require('../middleware/authMiddleware');

router.post('/add', authenticateToken, async (req, res) => {
  const { productId, name, price, quantity, image } = req.body;
  const userId = req.user.userId;

  //console.log('Adding item to cart:', { productId, name, price, quantity, image, userId });


  try {
    if (!productId || !name || price === undefined || quantity === undefined || !image) {
      console.error('Invalid request data:', { userId, productId, name, price, quantity, image });
      return res.status(400).json({ message: 'Invalid request data' });
    }

    //const userObjectId = new mongoose.Types.ObjectId(userId);
    //const productObjectId = new mongoose.Types.ObjectId(productId);

    const total = price * quantity;
    const cartItem = await Cart.findOneAndUpdate(
      { userId, productId },
      { $set: { name, price, image}, $inc: { quantity: quantity } },
      { new: true, upsert: true }
    );
    //console.log('Cart item added or updated:', cartItem);
    res.status(201).json(cartItem);
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const cartItems = await Cart.find({ userId });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', authenticateToken, async (req, res) => {
  const { quantity } = req.body;
  const userId = req.user.userId;

  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, userId });
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    console.error('Error updating cart item quantity:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId });
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error deleting cart item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const itemExists = await Cart.exists({ userId, productId: new mongoose.Types.ObjectId(productId) });
    res.json({ exists: !!itemExists });
  } catch (err) {
    console.error('Error in /check/:productId route:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;


