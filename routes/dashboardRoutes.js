const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const StockTransaction = require('../models/StockTransaction');
const { requireAuth } = require('../middleware/auth');

router.get('/stats', requireAuth, async (req, res) => {
    try {
        const products = await Product.find().populate('category');

        const totalProducts = products.length;
        const totalStockUnits = products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
        const lowStockProducts = products.filter(p => p.quantity > 0 && p.quantity <= p.lowStockThreshold);
        const outOfStockProducts = products.filter(p => p.quantity === 0);

        const categoryBreakdown = {};
        products.forEach(p => {
            const catName = p.category?.name || 'Uncategorized';
            categoryBreakdown[catName] = (categoryBreakdown[catName] || 0) + p.quantity;
        });

        const recentTransactions = await StockTransaction.find()
            .populate('product', 'name')
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalProducts,
            totalStockUnits,
            totalValue,
            lowStockCount: lowStockProducts.length,
            outOfStockCount: outOfStockProducts.length,
            lowStockProducts,
            outOfStockProducts,
            categoryBreakdown,
            recentTransactions,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
