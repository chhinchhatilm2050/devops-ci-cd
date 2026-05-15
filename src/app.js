import dotenv from 'dotenv';
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFound from './middlewares/notFound.js';
import globalLimiter from './middlewares/rateLimit.js';
import requestLogger from './middlewares/logger.js';
import helmet from 'helmet';
import router from './routes/index.js';
import fs from 'fs';
import path from 'path';

const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
const envPath = path.resolve(process.cwd(), envFile);

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

console.log(`Current NODE_ENV: ${process.env.NODE_ENV}`);

const app = express();
app.use(helmet());
app.use(globalLimiter);
app.use(requestLogger);
app.use(express.json());

app.get('/health', (req, res) => {
  console.log('Welcome chhinchhattt');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api', router);
app.use(globalErrorHandler);
app.use(notFound);

export default app;