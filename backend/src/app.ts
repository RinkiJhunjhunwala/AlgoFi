import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { nftRoutes } from './routes/nft.routes';
import { userRoutes } from './routes/user.routes';
import { marketplaceRoutes } from './routes/mp.routes';
import { errorHandler } from './utils/errorHandler';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/nft', nftRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/marketplace', marketplaceRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });

  return app;
};