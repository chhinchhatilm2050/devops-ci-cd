import dns from 'dns'
import mongoose from "mongoose";
dns.setServers(['8.8.8.8', '8.8.4.4'])
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            dbName: 'ecommerce-api-advanced'
        });
        console.log('MongDB connected successfully')
    } catch(error) {
       console.error('MongoDB connection error', error);
        process.exit(1);
    }
}

export {connectDB}