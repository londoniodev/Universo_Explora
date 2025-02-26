import { useAuthStore } from "../../../store/AuthStore.jsx";
import { LuShoppingBag } from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";
import { BsBoxSeam } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const CartPagePsychologist = () => {
  const { 
    cart, 
    removeFromCartPsychologistAccess,
    clearCartPsychologistAccess, 
    buyPsychologistAccesses,
    fetchCartPsychologistAccess,
    fetchPsychologistAccessBalance
  } = useAuthStore();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

  const handlePurchase = async () => {
    if (cart.length === 0) {
      toast.dismiss();
      toast.error("El carrito está vacío");
      return;
    }

    try {
      const purchasedAccesses = cart.map((item) => ({
        packageId: item.packageId,
        quantity: item.quantity || 1,
        price: item.price || 0,
      }));
      console.log("Intentando comprar:", purchasedAccesses);
      const response = await buyPsychologistAccesses(purchasedAccesses);

      if (response?.data?.success) {
        toast.dismiss();
        toast.success("Compra realizada con éxito");
        await clearCartPsychologistAccess();
        await fetchCartPsychologistAccess();
        fetchPsychologistAccessBalance();
        console.log("✅ Carrito después de la compra:", useAuthStore.getState().cart);
        navigate("/api/auth/psychologist-dashboard/payment/thank-you", { state: { purchasedAccesses } });
      } else {
        toast.dismiss();
        toast.error(response?.data?.message || "Error al procesar la compra");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Error al procesar la compra");
    }
  };

  return (
    <div className="w-full h-full text-gray-200 flex flex-col">
      <Toaster position="top-center" />

      <div className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 flex mt-[10%] items-center justify-center">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-gray-400">Tu carrito está vacío</p>
            <BsBoxSeam size={50} className="text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 mt-[10%] lg:grid-cols-2 gap-6">
            <ul className="space-y-6">
              {cart.map((item) => (
                <li key={item.packageId} className="flex bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="w-36 bg-gray-700 flex items-center justify-center">
                    <BsBoxSeam size={50} className="text-gray-500" />
                  </div>

                  <div className="flex-grow p-4 space-y-2">
                    <h2 className="text-lg font-bold">{item.title || "Sin título"}</h2>
                    <p className="text-gray-400 text-sm">Cantidad: {item.quantity || 1}</p>
                    <p className="text-gray-300 text-sm flex items-center">
                      <span className="text-green-400">${item.price} USD</span>
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCartPsychologistAccess(item.packageId)}
                    className="group p-3 hover:bg-red-600 transition duration-300 rounded-md"
                  >
                    <MdDelete className="w-6 h-6 text-white group-hover:text-white transition duration-300" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Resumen de tu pedido</h2>
              <div className="flex justify-between">
                <span className="text-gray-400">Total a pagar:</span>
                <span className="font-bold text-green-400">${Math.round(totalPrice)} USD</span>
              </div>
              <button onClick={handlePurchase} className="w-full mt-6 bg-green-500 text-gray-900 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-green-600 transition duration-300">
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

export default CartPagePsychologist;