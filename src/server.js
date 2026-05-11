import { connectDB } from './config/database.js';
import app from './app.js';
const PORT = process.env.PORT || 3000;
const inviroment = process.env.NODE_ENV || 'development';
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listen on port ${PORT} [${inviroment}]`);
    });
  } catch(error) {
    console.error('Server failed to start:', error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

