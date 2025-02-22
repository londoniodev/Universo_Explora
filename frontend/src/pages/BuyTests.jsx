import NavBar from "../assets/components/NavBar.jsx";
import { BsCartPlus } from "react-icons/bs";
import { useCart } from "../context/CartContext.jsx";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BuyTests = () => {
  const { cart, addToCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const previousPrice = 25;
  const currentPrice = 20;
  const discountPercentage = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);

  const handleAddToCart = async (pkg) => {
    if (!pkg?.testId || !pkg?.title || !pkg?.price) {
      toast.dismiss();
      toast.error("Error: Datos incompletos detectados");
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(pkg, 1);
      await fetchCart();

      const updatedCart = [...cart, { testId: pkg.testId, quantity: 1 }];
      const quantityInCart = updatedCart.filter((item) => item.testId === pkg.testId).length;

      toast.dismiss();
      toast.success(`¡${pkg.title} agregado al carrito! (Cantidad: ${quantityInCart})`);

      setTimeout(() => {
        navigate("/api/auth/dashboard/cart");
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error("Error al agregar el producto al carrito.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="container" className="min-h-screen flex flex-col">
      <Toaster />

      <header className="bg-white shadow-md sticky top-0 z-50">
        <NavBar />
      </header>

      <main className="flex-grow flex flex-col items-center pt-[6%] px-4">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Comprar Pruebas
        </h1>
        <p className="text-white mt-4 text-center max-w-3xl">
          Explora nuestras pruebas diseñadas para ayudarte a descubrir tus habilidades y orientar tus decisiones.
        </p>

        <section className="mt-3 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-8">
          <article className="relative bg-transparent rounded-lg shadow-lg overflow-hidden border border-green-900 w-[90%] max-w-[350px] mx-auto p-4 sm:p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-green-700 blur-sm opacity-70 pointer-events-none"></div>

            <div className="relative flex flex-col items-start space-y-3">
              <div className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-md shadow-md">
                ¡Oferta Especial!
              </div>

              <h2 className="text-xl font-bold text-white text-center">
                Paquete 1: Autoconocimiento y Orientación Vocacional
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed text-center">
                Descubre una serie de tests diseñados para ayudarte a explorar tus intereses, habilidades y personalidad, y guiarte hacia tus metas.
              </p>

              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Test de Contextualización
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Autoevaluación
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Test 16PF
                </li>
              </ul>

              <div className="flex flex-col items-center w-full mt-3 space-y-1">
                <p className="text-gray-400 text-sm">
                  Antes: <span className="line-through">${previousPrice} USD</span>
                </p>
                <p className="text-lg font-bold text-green-400">
                  Ahora: ${currentPrice} USD
                </p>
                <p className="text-sm font-semibold text-yellow-400">
                  ¡Ahorras: {discountPercentage}%!
                </p>
              </div>

              <div className="w-full mt-3">
                <button
                  onClick={() =>
                    handleAddToCart({
                      testId: "647ec1e2a5b8e930f4b1e1a3",
                      title: "Paquete 1: Autoconocimiento y Orientación Vocacional",
                      price: currentPrice,
                    })
                  }
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  } text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg`}
                >
                  {isLoading ? "Añadiendo..." : <>
                    <BsCartPlus /> <span>Agregar al carrito</span>
                  </>}
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default BuyTests;