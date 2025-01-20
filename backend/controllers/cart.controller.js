import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cart) {
      return res.status(200).json({ message: "Carrito vacío.", items: [] });
    }

    res.status(200).json({ items: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito.", error: error.message });
  }
};


export const addItemToCart = async (req, res) => {
  const { testId, title, price, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    return res.status(400).json({ success: false, message: "ID de paquete inválido." });
  }

  if (!title || !price || quantity <= 0) {
    return res.status(400).json({ success: false, message: "Datos del paquete inválidos." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const itemIndex = user.cart.findIndex((item) => item.testId.toString() === testId);
    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ testId, title, price, quantity });
    }

    await user.save();
    res.status(200).json({ items: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar al carrito." });
  }
};
export const removeItemFromCart = async (req, res) => {
  const { testId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(testId)) {
    return res.status(400).json({ message: "ID de paquete inválido." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.cart = user.cart.filter((item) => item.testId.toString() !== testId);
    await user.save();

    const cartWithDetails = user.cart.map((item) => ({
      testId: item.testId.toString(),
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    res.status(200).json({ items: cartWithDetails });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar del carrito." });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ message: "Carrito vaciado con éxito.", items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito." });
  }
};