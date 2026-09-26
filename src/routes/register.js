import express from 'express';
import registerController from '../controllers/registerController.js';

const router = express.Router();

router.post('/v1.0/register', (req, res) => registerController.register(req, res));

export default router;