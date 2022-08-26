//jshint esversion:6
const mongoose = require('mongoose');


const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
})



const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product;