import dotenv from 'dotenv';
import express from 'express';
import healthCheckRoutes from './routes/healthCheck.js';
import loginRoutes from './routes/login.js';
import registerRoutes from './routes/register.js';

dotenv.config();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

app.use('/api', healthCheckRoutes);
app.use('/api', loginRoutes);
app.use('/api', registerRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload',
      error: err.message,
    });
  }

  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
