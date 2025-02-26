import { User } from "../models/user.model.js";

/**
 * Obtiene el carrito del psicólogo.
 */
export const getCartPsychologist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.psychologistCart) {
      return res.status(200).json({ message: "Carrito vacío.", items: [] });
    }

    res.status(200).json({ items: user.psychologistCart });
  } catch (error) {
    console.error("⚠️ Error en getCartPsychologist:", error);
    res.status(500).json({ message: "Error al obtener el carrito." });
  }
};

/**
 * Agrega un paquete de accesos al carrito del psicólogo.
 */
export const addItemToCartPsychologist = async (req, res) => {
  const { packageId, title, price, quantity } = req.body;

  if (!packageId || !title || !price || quantity <= 0) {
    return res.status(400).json({ message: "Datos del paquete inválidos." });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (!user.psychologistCart) {
        user.psychologistCart = [];
      }
      
    const itemIndex = user.psychologistCart.findIndex((item) => item.packageId === packageId);
      
    if (itemIndex > -1) {
      user.psychologistCart[itemIndex].quantity += quantity;
    } else {
      user.psychologistCart.push({ packageId, title, price, quantity });
    }

    await user.save();
    res.status(200).json({ items: user.psychologistCart });
  } catch (error) {
    console.error("⚠️ Error en addItemToCartPsychologist:", error);
    res.status(500).json({ message: "Error al agregar el paquete al carrito." });
  }
};

/**
 * Elimina un paquete del carrito del psicólogo.
 */
export const removeItemFromCartPsychologist = async (req, res) => {
  try {
    const psychologistId = req.userId;
    const { packageId } = req.params;

    if (!packageId) {
      return res.status(400).json({ success: false, message: "Falta el packageId." });
    }

    const psychologist = await User.findById(psychologistId);
    if (!psychologist) {
      return res.status(404).json({ success: false, message: "Psicólogo no encontrado." });
    }

    // Filtramos el carrito para eliminar solo el ítem con ese packageId
    const updatedCart = psychologist.psychologistCart.filter(item => item.packageId !== packageId);

    // Si el carrito no cambió, significa que el paquete no existía
    if (updatedCart.length === psychologist.psychologistCart.length) {
      return res.status(404).json({ success: false, message: "El paquete no está en el carrito." });
    }

    psychologist.psychologistCart = updatedCart;
    await psychologist.save();

    return res.status(200).json({ success: true, message: "Paquete eliminado del carrito.", cart: updatedCart });
  } catch (error) {
    console.error("Error al eliminar paquete del carrito:", error);
    return res.status(500).json({ success: false, message: "Error al eliminar paquete del carrito." });
  }
};

/**
 * Vacía el carrito del psicólogo.
 */
export const clearCartPsychologist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.psychologistCart = [];
    await user.save();

    res.status(200).json({ message: "Carrito vaciado." });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito." });
  }
};