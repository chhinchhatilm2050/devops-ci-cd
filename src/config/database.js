
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      dbName: 'ecommerce-api-advanced'
    });
    console.log('MongDB connected successfully');
  } catch(error) {
    console.error('MongoDB connection error', error);
    process.exit(1);
  }
};

export {connectDB};