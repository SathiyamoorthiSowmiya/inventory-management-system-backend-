const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    type: {
        type: String,
        enum: ['in', 'out'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    note: {
        type: String,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
