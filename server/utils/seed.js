import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Subscriber from '../models/Subscriber.js';
import sampleProducts from '../data/sampleProducts.js';

dotenv.config();
await connectDB();

const seed = async () => {
  try {
    await Promise.all([
      Product.deleteMany(),
      User.deleteMany(),
      Order.deleteMany(),
      Cart.deleteMany(),
      Subscriber.deleteMany()
    ]);

    await User.create({
      name: 'ShopEase Admin',
      email: 'admin@shopease.dev',
      password: 'Admin123!',
      role: 'admin'
    });

    await Product.insertMany(sampleProducts);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
