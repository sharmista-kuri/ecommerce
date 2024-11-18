const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Assuming Cart model is defined

// Get items in the cart
router.get('/', async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an item to the cart
router.post('/add', async (req, res) => {
  const cartItem = new Cart(req.body);
  try {
    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// router.post('/add', async (req, res) => {
//   const { productId, name, price, quantity, image } = req.body;
//   const total = price * quantity;

//   try {
//     const cartItem = await Cart.findOneAndUpdate(
//       { productId },
//       { $inc: { quantity: 1, total: price } },
//       { new: true, upsert: true }
//     );
//     res.status(201).json(cartItem);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Update quantity of a specific item in the cart by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove an item from the cart by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
