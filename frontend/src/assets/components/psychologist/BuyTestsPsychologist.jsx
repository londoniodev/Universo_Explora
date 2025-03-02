import { BsCartPlus } from "react-icons/bs";
import { useAuthStore } from "../../../store/AuthStore.jsx";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";

const BuyTestsPsychologist = () => {
  const { addToCartPsychologistAccess, fetchCartPsychologistAccess } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const packageInfo = {
    packageId: "647ec1e2a5b8e930f4b1e1a3",
    title: "Paquete 1: Autoconocimiento y Orientación Vocacional",
    price: 100,
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      toast.dismiss();
      toast.error("Debes agregar al menos 1 acceso.");
      return;
    }

    setIsLoading(true);
    try {
      await addToCartPsychologistAccess(
        packageInfo.packageId,
        packageInfo.title,
        packageInfo.price,
        quantity
      );

      await fetchCartPsychologistAccess();
      toast.dismiss();
      toast.success(`¡${quantity} ${packageInfo.title} agregado(s) al carrito!`);
    } catch (error) {
      toast.dismiss();
      toast.error("Error al agregar el paquete al carrito.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Toaster />
      <main className="flex-grow flex flex-col items-center pt-[6%] px-4">
        <h1 className="text-4xl font-extrabold text-white text-center">Comprar Accesos para Psicólogos</h1>
        <p className="text-white mt-4 text-center max-w-3xl">
          Compra paquetes de accesos para asignar a tus pacientes.
        </p>

        <section className="mt-3 w-full max-w-5xl flex flex-col items-center">
          <article className="bg-gray-800 text-white rounded-lg shadow-lg p-5 w-[90%] max-w-[350px]">
            <h2 className="text-xl font-bold text-center">{packageInfo.title}</h2>
            <p className="text-gray-400 text-center mt-2">Incluye accesos para pruebas.</p>

            <div className="flex flex-col items-center w-full mt-3">
              <p className="text-lg font-bold text-green-400">Precio: ${packageInfo.price} USD</p>
            </div>

            <div className="flex items-center justify-center mt-3">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="bg-gray-600 text-white px-3 py-1 rounded-l-lg hover:bg-gray-500 transition"
              >
                -
              </button>
              <input
                type="number"
                className="w-16 text-center bg-gray-700 text-white py-1 border-none"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="bg-gray-600 text-white px-3 py-1 rounded-r-lg hover:bg-gray-500 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`w-full mt-3 ${
                isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              } text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2`}
            >
              {isLoading ? "Añadiendo..." : <><BsCartPlus /> <span>Agregar al carrito</span></>}
            </button>
          </article>
        </section>
      </main>
    </div>
  );
};

export default BuyTestsPsychologist;