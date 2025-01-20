import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { handlePurchase, getRecentPurchase } from '../controllers/purchase.controller.js';

const router = express.Router();

router.post('/', verifyToken, handlePurchase);
router.get('/recent', verifyToken, getRecentPurchase);
router.post('/simulate', verifyToken, handlePurchase);

export default router;