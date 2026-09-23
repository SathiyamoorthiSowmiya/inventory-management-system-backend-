const express = require('express');
const router = express.Router();
const StockTransaction = require('../models/StockTransaction');
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/auth');

// GET all stock transactions (most recent first)
router.get('/', requireAuth, async (req, res) => {
    try {
        const transactions = await StockTransaction.find()
            .populate('product', 'name')
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST record a stock in/out transaction and adjust product quantity
router.post('/', requireAuth, async (req, res) => {
    try {
        const { productId, type, quantity, note } = req.body;

        if (!['in', 'out'].includes(type)) {
            return res.status(400).json({ message: 'Type must be "in" or "out"' });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (type === 'out' && product.quantity < quantity) {
            return res.status(400).json({ message: `Not enough stock. Only ${product.quantity} available.` });
        }

        product.quantity += type === 'in' ? Number(quantity) : -Number(quantity);
        await product.save();

        const transaction = await StockTransaction.create({
            product: productId,
            type,
            quantity,
            note,
            user: req.user.id,
        });

        const populated = await transaction.populate([
            { path: 'product', select: 'name' },
            { path: 'user', select: 'username' },
        ]);

        res.status(201).json({ transaction: populated, updatedProduct: await product.populate('category') });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
