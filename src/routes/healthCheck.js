import express from 'express';
import healthController from '../controllers/healthController.js';

const router = express.Router();

router.get('/v1.0/healthCheck', (req, res) => healthController.checkHealth(req, res));

export default router;
