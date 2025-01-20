import express from 'express';
import mongoose from 'mongoose';
import { getCart, addItemToCart, removeItemFromCart, clearCart } from '../controllers/cart.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const router = express.Router();

router.get('/', verifyToken, getCart);

router.post(
  '/',
  verifyToken,
  body('testId')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('ID de test inválido.'),
  body('quantity').isInt({ gt: 0 }).withMessage('La cantidad debe ser mayor a 0.'),
  validateRequest,
  addItemToCart
);

router.delete(
  '/item',
  verifyToken,
  body('testId')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('ID de test inválido.'),
  validateRequest,
  removeItemFromCart
);

router.delete('/', verifyToken, clearCart);

export default router;