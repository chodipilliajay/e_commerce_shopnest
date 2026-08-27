// Seeds the database with demo products across categories, with relevant images and
// realistic discounts, plus a demo admin account.
// Run from the backend folder with: npm run seed

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

if (!process.env.DB_URI) {
    console.error('DB_URI is not set. Check that backend/config/config.env exists and has a valid DB_URI value (not the placeholder).');
    process.exit(1);
}

import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

const ADMIN_EMAIL = process.env.SMTP_MAIL && process.env.SMTP_MAIL !== 'your-email@gmail.com'
    ? process.env.SMTP_MAIL
    : 'admin@shopnest.com';
const PRODUCTS_PER_CATEGORY = 80;

const catalog = {
    Electronics: {
        keywords: 'electronics,gadget',
        items: [
            ['Wireless Headphones', 'headphones'],
            ['Bluetooth Speaker', 'bluetooth-speaker,speaker'],
            ['Smartwatch', 'smartwatch'],
            ['Power Bank', 'power-bank,charger'],
            ['Laptop Stand', 'laptop-stand,laptop'],
            ['Mechanical Keyboard', 'keyboard,computer'],
            ['Wireless Mouse', 'computer-mouse'],
            ['4K Monitor', 'monitor,computer-screen'],
            ['Webcam', 'webcam'],
            ['USB-C Hub', 'usb,electronics'],
        ],
    },
    Fashion: {
        keywords: 'fashion,clothing',
        items: [
            ['Cotton T-Shirt', 'tshirt,clothing'],
            ['Slim Fit Jeans', 'jeans,denim'],
            ['Bomber Jacket', 'jacket,clothing'],
            ['Running Sneakers', 'sneakers,shoes'],
            ['Leather Backpack', 'backpack,bag'],
            ['Aviator Sunglasses', 'sunglasses'],
            ['Analog Wristwatch', 'wristwatch'],
            ['Leather Belt', 'leather-belt'],
            ['Baseball Cap', 'cap,hat'],
            ['Wool Scarf', 'scarf'],
        ],
    },
    'Home & Kitchen': {
        keywords: 'home,kitchen',
        items: [
            ['Countertop Blender', 'blender,kitchen'],
            ['Non-Stick Cookware Set', 'cookware,pots'],
            ['Robot Vacuum Cleaner', 'vacuum-cleaner'],
            ['Digital Air Fryer', 'air-fryer,kitchen'],
            ['Drip Coffee Maker', 'coffee-maker'],
            ['2-Slice Toaster', 'toaster,kitchen'],
            ['Ceramic Dinner Set', 'dinnerware,plates'],
            ['Stackable Storage Boxes', 'storage-box'],
            ['Cotton Bedsheet Set', 'bedsheet,bedroom'],
            ['LED Table Lamp', 'table-lamp,lamp'],
        ],
    },
    Books: {
        keywords: 'books,reading',
        items: [
            ['Bestselling Novel', 'book,novel'],
            ['Gourmet Cookbook', 'cookbook,recipes'],
            ['Inspiring Biography', 'book,biography'],
            ['Self-Help Guide', 'book,selfhelp'],
            ['Engineering Textbook', 'textbook,books'],
            ['Comic Collection', 'comicbook'],
            ['Poetry Anthology', 'poetry,book'],
            ['World Travel Guide', 'travel-book'],
            ['World History Book', 'history-book'],
            ['Ruled Notebook Set', 'notebook,stationery'],
        ],
    },
    Sports: {
        keywords: 'sports,fitness',
        items: [
            ['Non-Slip Yoga Mat', 'yoga-mat,yoga'],
            ['Adjustable Dumbbell Set', 'dumbbells,gym'],
            ['Cricket Bat', 'cricket-bat,cricket'],
            ['Match Football', 'football,soccer'],
            ['Running Shoes', 'running-shoes,sneakers'],
            ['Gym Duffel Bag', 'gym-bag'],
            ['Speed Skipping Rope', 'jump-rope'],
            ['Cycling Helmet', 'bike-helmet'],
            ['Badminton Racket', 'badminton,racket'],
            ['Fitness Tracker Band', 'fitness-tracker,smartwatch'],
        ],
    },
    Beauty: {
        keywords: 'beauty,cosmetics',
        items: [
            ['Hydrating Face Cream', 'skincare,cream'],
            ['Herbal Shampoo', 'shampoo,haircare'],
            ['Signature Perfume', 'perfume,fragrance'],
            ['Matte Lipstick', 'lipstick,makeup'],
            ['Ionic Hair Dryer', 'hairdryer'],
            ['Beard Trimmer', 'trimmer,grooming'],
            ['SPF 50 Sunscreen', 'sunscreen,skincare'],
            ['Gentle Face Wash', 'facewash,skincare'],
            ['Manicure Nail Kit', 'nailpolish,manicure'],
            ['Makeup Brush Set', 'makeup-brush,cosmetics'],
        ],
    },
    'Fruits & Vegetables': {
        keywords: 'fruits,vegetables',
        items: [
            ['Fresh Apples', 'apple,fruit'],
            ['Ripe Bananas', 'banana,fruit'],
            ['Farm Tomatoes', 'tomato,vegetable'],
            ['Baby Potatoes', 'potato,vegetable'],
            ['Red Onions', 'onion,vegetable'],
            ['Baby Spinach Bunch', 'spinach,leafy-greens'],
            ['Juicy Oranges', 'orange,fruit'],
            ['Fresh Carrots', 'carrot,vegetable'],
            ['Broccoli Florets', 'broccoli,vegetable'],
            ['Alphonso Mangoes', 'mango,fruit'],
            ['Seedless Grapes', 'grapes,fruit'],
            ['Bell Peppers Pack', 'bell-pepper,vegetable'],
            ['Ripe Avocados', 'avocado,fruit'],
            ['Farm Cucumbers', 'cucumber,vegetable'],
            ['Sweet Strawberries', 'strawberry,fruit'],
        ],
    },
};

const adjectives = ['Premium', 'Classic', 'Modern', 'Deluxe', 'Compact', 'Portable', 'Pro', 'Essential', 'Signature', 'Everyday'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const produceAdjectives = ['Farm Fresh', 'Organic', 'Locally Sourced', 'Handpicked', 'Naturally Ripened', 'Garden Fresh', 'Sun-Ripened', 'Premium'];

const generateProducts = (category, keywordBase, items, adminUserId, startIndex) => {
    const isProduce = category === 'Fruits & Vegetables';
    const products = [];
    for (let i = 0; i < PRODUCTS_PER_CATEGORY; i++) {
        const globalIndex = startIndex + i;
        const [itemName, itemKeywords] = randomFrom(items);
        const adjective = randomFrom(isProduce ? produceAdjectives : adjectives);
        const name = isProduce ? `${adjective} ${itemName} ${globalIndex}` : `${adjective} ${itemName} ${globalIndex}`;
        const price = isProduce ? randomInt(29, 399) : randomInt(199, 24999);
        const hasDiscount = Math.random() < 0.4;
        const cutPrice = hasDiscount ? Math.round(price * (1 + randomInt(10, 60) / 100)) : 0;
        const description = isProduce
            ? `${adjective} ${itemName.toLowerCase()}, sourced daily for peak freshness. Sold per kg, hand-checked for quality before dispatch.`
            : `${adjective} ${itemName.toLowerCase()} from our ${category} collection. Quality-checked, great value, and built to last.`;

        products.push({
            name,
            description,
            price,
            cutPrice,
            category,
            stock: randomInt(0, 150),
            images: [{ url: `https://loremflickr.com/600/600/${itemKeywords}?lock=${globalIndex}` }],
            ratings: Math.round(Math.random() * 5 * 10) / 10,
            numOfReviews: 0,
            reviews: [],
            user: adminUserId,
        });
    }
    return products;
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected for seeding...');

        let admin = await User.findOne({ email: ADMIN_EMAIL });
        if (!admin) {
            admin = await User.create({
                name: 'ShopNest Admin',
                email: ADMIN_EMAIL,
                password: 'Admin@1234',
                role: 'admin',
            });
            console.log(`Created demo admin: ${ADMIN_EMAIL} / password: Admin@1234 (change this after logging in)`);
        } else {
            console.log(`Using existing admin account: ${ADMIN_EMAIL}`);
        }

        const existingCount = await Product.countDocuments();
        if (existingCount > 0) {
            console.log(`Removing ${existingCount} existing product(s)...`);
            await Product.deleteMany();
        }

        const categories = Object.keys(catalog);
        const totalToInsert = categories.length * PRODUCTS_PER_CATEGORY;
        console.log(`Seeding ${totalToInsert} products across ${categories.length} categories...`);

        let inserted = 0;
        let globalIndex = 1;
        for (const category of categories) {
            const { keywords, items } = catalog[category];
            const products = generateProducts(category, keywords, items, admin._id, globalIndex);
            globalIndex += PRODUCTS_PER_CATEGORY;
            await Product.insertMany(products);
            inserted += products.length;
            console.log(`Inserted ${inserted}/${totalToInsert} (${category})`);
        }

        console.log(`Done. Seeded ${inserted} products across ${categories.length} categories.`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seed();
