const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', async (req, res) => {
  console.log('Reached POST /api/products/add');
  const product = new Product({
    id: req.body.id,
    name: req.body.name,
    description: req.body.description,
    OriginalPrice: req.body.OriginalPrice,
    discountedPrice: req.body.discountedPrice,
    price: req.body.price,
    isClearance: req.body.isClearance,
    Clearance: req.body.Clearance,
    image: req.body.image
  });
  
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('Reached DELETE /api/products/:id');
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

module.exports = router;
