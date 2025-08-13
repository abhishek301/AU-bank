import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import salesRoutes from './routes/salesRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Security and optimization middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api/sales', salesRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Sales API server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/sales`);
});

export default app;