const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    OriginalPrice: Number,
    discountedPrice: Number,
    price: Number,
    isClearance: String,
    Clearance: String,
    image: String
});

module.exports = mongoose.model('Product', ProductSchema);
