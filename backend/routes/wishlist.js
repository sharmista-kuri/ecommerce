const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist'); 
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const wishlistItems = await Wishlist.find({ userId });
    res.json(wishlistItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', authenticateToken, async (req, res) => {
  const { productId, name, price, image } = req.body;
  const userId = req.user.userId;

  try {
    const wishlistItem = new Wishlist({ userId, productId, name, price, image });
    const savedItem = await wishlistItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete('/item/:productId', authenticateToken, async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;
  console.log("hi");
  try {
    // Convert `productId` to ObjectId if necessary
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find and delete the item from the user's wishlist
    const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId: productObjectId });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error('Error deleting wishlist item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});




// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedItem = await Wishlist.findByIdAndDelete(req.params.id);
//     if (!deletedItem) return res.status(404).json({ message: 'Wishlist item not found' });
//     res.json({ message: 'Item removed from wishlist' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  //console.log(req.params.id);
  const wishlistId = new mongoose.Types.ObjectId(req.params.id);
  try {
    const deletedItem = await Wishlist.findOneAndDelete({ _id: wishlistId, userId });
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });

    res.json({ message: 'Item removed from wishlist' });
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

    const itemExists = await Wishlist.exists({ productId: new mongoose.Types.ObjectId(productId), userId });
    res.json({ exists: !!itemExists }); // Return boolean result
  } catch (err) {
    console.error('Error in /check/:productId route:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get('/item/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log('Requested productId:', productId); 

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const wishlistItem = await Wishlist.findOne({ productId: new mongoose.Types.ObjectId(productId) });
    
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    res.json(wishlistItem);
  } catch (err) {
    console.error('Error in /item/:productId route:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
