import NavBar from "../assets/components/NavBar.jsx";
import { BsCartPlus } from "react-icons/bs";
import { useCart } from "../context/CartContext.jsx";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BuyTests = () => {
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const previousPrice = 25;
  const currentPrice = 20;
  const discountPercentage = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);

  const handleAddToCart = async (pkg) => {
    if (!pkg.testId || !pkg.title || !pkg.price) {
      toast.dismiss();
      toast.error("Error: Datos incompletos detectados");
      return;
    }
    await addToCart(pkg, 1);
    const updatedCart = cart.find((item) => item.testId === pkg.testId);
    const quantityInCart = updatedCart ? updatedCart.quantity + 1 : 1;
    toast.dismiss();
    toast.success(`¡${pkg.title} agregado al carrito! (Cantidad: ${quantityInCart})`);
    
    setTimeout(() => {
      toast.success("Redirigiendo a carrito...");
      navigate("/api/auth/dashboard/cart");
    },1000);
    
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <Toaster />

      <header className="bg-white shadow-md sticky top-0 z-50">
        <NavBar />
      </header>

      <main className="flex-grow flex flex-col items-center pt-[8%] px-4">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Comprar Pruebas
        </h1>
        <p className="text-white mt-4 text-center max-w-2xl">
          Explora nuestras pruebas diseñadas para ayudarte a descubrir tus habilidades y orientar tus decisiones.
        </p>

        <section className="mt-12 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-8">
          <article className="relative bg-gray-950 rounded-lg shadow-lg overflow-hidden border border-green-900">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-green-700 blur-sm opacity-70 pointer-events-none"></div>

            <div className="relative p-6 flex flex-col items-start space-y-4">
              <div className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded-md shadow-md z-10">
                ¡Oferta Especial!
              </div>

              <h2 className="text-2xl font-bold text-white">
                Paquete 1: Autoconocimiento y Orientación Vocacional
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Descubre una serie de tests diseñados para ayudarte a explorar tus intereses, habilidades y personalidad, y guiarte hacia tus metas.
              </p>

              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3"></span>
                  Test de Contextualización
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3"></span>
                  Autoevaluación
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3"></span>
                  Test 16PF
                </li>
              </ul>

              <div className="flex items-center justify-between w-full mt-4">
                <div>
                  <p className="text-gray-400 text-sm">
                    Antes: <span className="line-through">${previousPrice} USD</span>
                  </p>
                  <p className="text-lg font-bold text-green-400">
                    Ahora: ${currentPrice} USD
                  </p>
                </div>
                <p className="text-ml font-semibold text-yellow-400">
                  ¡Ahorras: {discountPercentage}%!
                </p>
              </div>

              <div className="w-full mt-4">
                <button
                  onClick={() =>
                    handleAddToCart({
                      testId: "647ec1e2a5b8e930f4b1e1a3",
                      title: "Paquete 1: Autoconocimiento y Orientación Vocacional",
                      price: currentPrice,
                    })
                  }
                  className="w-full bg-green-500 text-white font-medium py-3 rounded-lg flex flex-row items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <BsCartPlus /> <span>Agregar al carrito</span>
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
