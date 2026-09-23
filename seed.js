require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
    { name: 'Electronics', description: 'Electronic devices and accessories' },
    { name: 'Stationery', description: 'Office and school supplies' },
    { name: 'Furniture', description: 'Office and home furniture' },
    { name: 'Groceries', description: 'Food and daily essentials' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        await Category.deleteMany({});
        const createdCategories = await Category.insertMany(categories);
        console.log(`Seeded ${createdCategories.length} categories`);

        const catMap = {};
        createdCategories.forEach(c => { catMap[c.name] = c._id; });

        const products = [
            { name: 'Wireless Mouse', category: catMap['Electronics'], quantity: 45, price: 599, lowStockThreshold: 15, description: 'Ergonomic wireless mouse' },
            { name: 'USB-C Cable', category: catMap['Electronics'], quantity: 8, price: 199, lowStockThreshold: 15, description: '1.5m fast charging cable' },
            { name: 'Bluetooth Speaker', category: catMap['Electronics'], quantity: 0, price: 1499, lowStockThreshold: 10, description: 'Portable Bluetooth speaker' },
            { name: 'A4 Notebook', category: catMap['Stationery'], quantity: 120, price: 49, lowStockThreshold: 30, description: '200-page ruled notebook' },
            { name: 'Ballpoint Pen (Box of 10)', category: catMap['Stationery'], quantity: 5, price: 89, lowStockThreshold: 10, description: 'Smooth writing pens' },
            { name: 'Office Chair', category: catMap['Furniture'], quantity: 12, price: 4999, lowStockThreshold: 5, description: 'Adjustable ergonomic chair' },
            { name: 'Study Table', category: catMap['Furniture'], quantity: 3, price: 3499, lowStockThreshold: 5, description: 'Compact wooden study table' },
            { name: 'Basmati Rice (5kg)', category: catMap['Groceries'], quantity: 60, price: 649, lowStockThreshold: 20, description: 'Premium basmati rice' },
        ];

        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products`);

        const adminExists = await User.findOne({ email: 'admin@inventory.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await User.create({
                username: 'admin',
                email: 'admin@inventory.com',
                password: hashedPassword,
                role: 'admin',
            });
            console.log('Admin user created: admin@inventory.com / Admin@123');
        } else {
            console.log('Admin user already exists');
        }

        console.log('Seed complete');
        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();
