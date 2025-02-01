import { useCart } from "../context/CartContext.jsx";
import { LuShoppingBag } from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";
import { BsBoxSeam } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useAuthStore } from "../store/AuthStore.jsx";
import { useNavigate } from "react-router-dom";
import Navbar from "../assets/components/NavBar.jsx";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { buyTests } = useAuthStore();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  const totalPreviousPrice = cart.reduce(
    (total, item) => total + ((item.previousPrice || item.price * 1.25) * (item.quantity || 1)),
    0
  );
  const totalDiscountPercentage = Math.round(
    ((totalPreviousPrice - totalPrice) / totalPreviousPrice) * 100
  );

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      toast.error("No se pudo eliminar el producto");
    }
  };

  const handlePurchase = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      const purchasedTests = cart.map((item) => ({
        id: item.testId,
        quantity: item.quantity || 1,
        title: item.title || "Sin título",
        price: item.price || 0,
      }));

      const response = await buyTests(purchasedTests);

      if (response?.data?.success) {
        toast.success("Compra realizada con éxito");
        clearCart();
        navigate("/api/auth/dashboard/payment/thank-you", { state: { purchasedTests } });
      } else {
        toast.error(response?.data?.message || "Error al procesar la compra");
      }
    } catch (error) {
      toast.error("Error al procesar la compra");
    }
  };

  return (
    <div id="container" className="min-h-screen text-gray-200 flex flex-col">
      <Toaster position="top-center" />
      <Navbar />
      <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 flex mt-[-4%] items-center justify-center">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-gray-400">Tu carrito está vacío</p>
            <BsBoxSeam size={50} className="text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ul className="space-y-6">
              {cart.map((item) => {
                const previousPrice = Math.round(item.previousPrice || item.price * 1.25);
                const currentPrice = Math.round(item.price || 0);
                const discountPercentage = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);

                return (
                  <li
                    key={item.testId}
                    className="flex bg-gray-800 rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="w-36 bg-gray-700 flex items-center justify-center">
                      <BsBoxSeam size={50} className="text-gray-500" />
                    </div>

                    <div className="flex-grow p-4 space-y-2">
                      <h2 className="text-lg font-bold">{item.title || "Sin título"}</h2>
                      <p className="text-gray-400 text-sm">Cantidad: {item.quantity || 1}</p>
                      <p className="text-gray-300 text-sm flex items-center">
                        <span className="line-through text-gray-500 mr-2">${previousPrice} USD</span>
                        <span className="text-green-400">${currentPrice} USD</span>
                      </p>
                      <p className="text-yellow-400 font-semibold">Ahorro: {discountPercentage}%</p>
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.testId)}
                      className="group p-3 hover:bg-red-600 transition duration-300 rounded-md"
                    >
                      <MdDelete className="w-6 h-6 text-white group-hover:text-white transition duration-300" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Resumen de tu pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Artículos totales:</span>
                  <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="font-bold text-gray-300">${Math.round(totalPreviousPrice)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Descuento aplicado:</span>
                  <span className="font-bold text-yellow-400">{totalDiscountPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total a pagar:</span>
                  <span className="font-bold text-green-400">${Math.round(totalPrice)} USD</span>
                </div>
              </div>
              <button
                onClick={handlePurchase}
                className="w-full mt-6 bg-green-500 text-gray-900 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-green-600 transition duration-300"
              >
                <LuShoppingBag className="mr-2" />
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;