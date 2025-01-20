import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart", { withCredentials: true });
      const validatedCart = (response.data.items || []).map((item) => ({
        testId: item.testId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      setCart(validatedCart);
    } catch (error) {
      console.log("No se pudo cargar el carrito. Se cargará el carrito cuando el usuario sea autenticado");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (pkg, count) => {
    if (!pkg.testId || !pkg.title || !pkg.price) {
      toast.error("Error: Datos incompletos detectados");
      return;
    }
    try {
      const response = await axios.post(
        "/api/cart",
        {
          testId: pkg.testId,
          title: pkg.title,
          price: pkg.price,
          quantity: count,
        },
        { withCredentials: true }
      );
      const updatedCart = (response.data.items || []).map((item) => ({
        testId: item.testId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      setCart(updatedCart);
      toast.success(`${pkg.title} agregado al carrito`);
    } catch (error) {
      toast.error("Error al agregar al carrito");
    }
  };

  const removeFromCart = async (testId) => {
    try {
      const response = await axios.delete(`/api/cart/item`, {
        data: { testId },
        withCredentials: true,
      });
      const updatedCart = (response.data.items || []).map((item) => ({
        testId: item.testId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));
      setCart(updatedCart);
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      toast.error("Error al eliminar del carrito");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/api/cart", { withCredentials: true });
      setCart([]);
      toast.success("Carrito vaciado");
    } catch (error) {
      toast.error("Error al vaciar el carrito");
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};