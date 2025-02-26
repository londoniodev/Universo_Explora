import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isPsychologist } from "../middleware/auth.middleware.js";
import { handlePsychologistPurchase, getPsychologistPurchases, getPsychologistAccessBalance } from "../controllers/psychologistPurchase.controller.js";

import { 
  getCartPsychologist, 
  addItemToCartPsychologist, 
  removeItemFromCartPsychologist, 
  clearCartPsychologist 
} from "../controllers/psychologistCart.controller.js";

const router = express.Router();

// Rutas de compra
router.post("/purchase", verifyToken, isPsychologist, handlePsychologistPurchase);
router.get("/purchases", verifyToken, isPsychologist, getPsychologistPurchases);
router.get("/access-balance", verifyToken, isPsychologist, getPsychologistAccessBalance);

// 🚀 Agregamos las rutas del carrito del psicólogo
router.get("/cart", verifyToken, isPsychologist, getCartPsychologist);
router.post("/cart", verifyToken, isPsychologist, addItemToCartPsychologist);
router.delete("/cart", verifyToken, isPsychologist, clearCartPsychologist);
router.delete("/cart/:packageId", verifyToken, isPsychologist, removeItemFromCartPsychologist);


export default router;