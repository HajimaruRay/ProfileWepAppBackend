import express from 'express';
import loginController from '../controllers/loginController.js';

const router = express.Router();

router.post('/v1.0/login', (req, res) => loginController.login(req, res));

export default router;