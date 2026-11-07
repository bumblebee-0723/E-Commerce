import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

// Cross-Origin Resource Sharing (matching Spring Boot's @CrossOrigin)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'UP',
    service: 'E-commerce Node.js Backend',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

// API Routes (matching Spring Boot's @RequestMapping("api"))
app.use('/api', apiRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
