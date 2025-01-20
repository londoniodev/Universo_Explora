import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCheckCircle, BsHouseDoor } from "react-icons/bs";
import axios from "axios";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [recentPurchase, setRecentPurchase] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const fetchRecentPurchase = async () => {
      try {
        const response = await axios.get("/api/purchase/recent", { withCredentials: true });
        if (response.data.success) {
          const purchases = response.data.recentPurchase || [];
          setRecentPurchase(purchases);
  
          const total = purchases.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
          );
          setTotalPrice(total);
        } else {
          setRecentPurchase([]);
        }
      } catch (error) {
        setRecentPurchase([]);
      }
    };
  
    fetchRecentPurchase();
  }, []);  

  const handleReturn = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      navigate("/api/auth/dashboard");
    }, 3000);
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center transition-all duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-bold text-gray-800 animate-fade-in">
            Volviendo a la Dashboard...
          </p>
        </div>

        <div className="relative flex items-center justify-center mt-8 w-3/4 max-w-md">
          <div className="flex flex-col items-center">
            <BsCheckCircle className="text-4xl text-green-500" />
            <p className="text-sm text-gray-600 mt-2">Pago Exitoso</p>
          </div>

          <div className="flex-1 h-1 mx-4 bg-gray-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-3000 w-full"></div>
          </div>

          <div className="flex flex-col items-center">
            <BsHouseDoor className="text-4xl text-blue-600" />
            <p className="text-sm text-gray-600 mt-2">Dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-10 max-w-3xl w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-sm font-medium text-green-600">
          Confirmación de Pago Exitoso
        </h1>
        <h2 className="text-4xl font-bold text-blue-700 mb-4">¡Gracias por tu compra!</h2>
        <p className="text-lg text-gray-600">
          Tu pedido ha sido procesado exitosamente. A continuación, te presentamos los detalles de la transacción.
        </p>
      </div>

        {recentPurchase.length > 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detalles de tu compra</h2>
            <ul className="divide-y divide-gray-300">
              {recentPurchase.map((item, index) => (
                <li key={index} className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-base font-medium text-gray-700">{item.title}</span>
                    <div className="text-sm text-gray-500">Cantidad: {item.quantity}</div>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    ${Number(item.price || 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-300 mt-6 pt-4 flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-blue-700">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-lg text-red-500 text-center">No se encontraron datos de compra.</p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleReturn}
            className="py-3 px-8 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300"
          >
            Volver al Dashboard
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Si tienes alguna pregunta sobre tu compra,{" "}
          <a href="/support" className="text-blue-600 underline hover:text-blue-800 transition-colors">
            contáctanos aquí
          </a>.
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;