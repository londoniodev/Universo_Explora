import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/AuthStore.jsx";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../assets/components/NavBar.jsx";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const { user, fetchUserData, validateUserAccessToken } = useAuthStore();
  
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (user && user.name) {
      const hasSeenWelcomeNotification = localStorage.getItem("hasSeenWelcomeNotification");
      if (!hasSeenWelcomeNotification) {
        toast.success(`¡Hola, ${user.name}! Bienvenido`, { duration: 4000 });
        localStorage.setItem("hasSeenWelcomeNotification", true);
      }

      const fromThankYouPage = localStorage.getItem("fromThankYouPage");
      if (fromThankYouPage) {
        toast.success("¡Ahora puedes empezar a realizar las pruebas!", { duration: 5000 });
        localStorage.removeItem("fromThankYouPage");
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user?.testProgress || !user?.purchasedTests) {
      fetchUserData();
    }
  }, [user, user?.purchasedTests, fetchUserData]);

  const handleTokenSubmit = async () => {
    if (!token.trim()) {
      toast.error("Debes ingresar un token.");
      return;
    }
  
    const response = await validateUserAccessToken(token);
  
    if (response) {
      console.log("🔄 Llamando a fetchUserData()...");
      await fetchUserData();
  
      const user = useAuthStore.getState().user;
      console.log("🔍 Usuario después de actualizar con fetchUserData:", user);
  
      if (user?.role === "psychologist") {
        console.log("👨‍⚕️ Psicólogo detectado. Actualizando saldo de accesos...");
        await useAuthStore.getState().fetchPsychologistAccessBalance();
      } else {
        console.log("👤 Usuario normal. No se actualiza saldo de accesos.");
      }
  
      // 🚀 ✅ Esperar a que el usuario se actualice antes de verificar el acceso
      setTimeout(async () => {
        const hasAccess = await useAuthStore.getState().verifyUserPackageAccess(response.packageId, { withCredentials: true });

  
        if (!hasAccess) {
          toast.error("No tienes acceso a este paquete.");
          return;
        }
  
        // ✅ **Redirigir al usuario después de validar el acceso**
        navigate(`/api/auth/dashboard/package/${response.packageId}`);
      }, 1000);
    }
  };
  
  return (
    <div className="relative min-h-screen bg-[#101828] flex flex-col text-white">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-6">
        <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wide">
          Bienvenido al Dashboard
        </h1>

        <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-2 text-white">Ingresa tu Token</h3>
          <input
            type="text"
            placeholder="Ejemplo: abc123def456"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 text-gray-800 rounded-md"
          />
          <button
            onClick={handleTokenSubmit}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Validar Token
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl w-full">
          {user?.purchasedTests?.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.4,
                ease: "easeOut",
              }}
              className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <Link to={`/api/auth/dashboard/package/${test.id}`}>
                <h3 className="text-2xl font-bold mb-4 text-white">{test.title}</h3>
                <p className="text-sm text-gray-300">
                  Haz clic para obtener más detalles
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;