import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/AuthStore.jsx";
import { Link } from "react-router-dom";
import Navbar from "../assets/components/NavBar.jsx";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const { user, fetchUserData } = useAuthStore();

  const getTestStatus = (testId) => {
    const status = user?.testProgress?.[testId] || "locked";
    switch (status) {
      case "completed":
        return "Completado";
      case "inProgress":
        return "En Progreso";
      case "locked":
      default:
        return "No Iniciado";
    }
  };  

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
    if (!user?.testProgress) {
      fetchUserData();
    }
  }, [user, fetchUserData]);  

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center px-4 md:px-6">
        <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wide">
          Bienvenido al Dashboard
        </h1>

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
                <span
                  className={`absolute top-3 right-3 text-sm px-3 py-1 rounded-full font-semibold ${
                    getTestStatus(test.id) === "Completado"
                      ? "bg-green-500 text-white"
                      : getTestStatus(test.id) === "En Progreso"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {getTestStatus(test.id)}
                </span>
                <h3 className="text-2xl font-bold mb-4 text-white">{test.title}</h3>
                <p className="text-sm text-gray-300">
                  Haz clic para obtener más detalles
                </p>
              </Link>
            </motion.div>
          ))}

          {user?.purchasedTests?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: user?.purchasedTests.length * 0.2,
                duration: 0.4,
                ease: "easeOut",
              }}
              className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-6 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <Link to={`/api/auth/dashboard/package/${user.purchasedTests[0].id}/short-contextualization`}>
                <span
                  className={`absolute top-3 right-3 text-sm px-3 py-1 rounded-full font-semibold ${
                    getTestStatus("shortContextualization") === "Completado"
                      ? "bg-green-500 text-white"
                      : getTestStatus("shortContextualization") === "En Progreso"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {getTestStatus("shortContextualization")}
                </span>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Cuestionario de Contextualización Corto
                </h3>
                <p className="text-sm text-gray-300">Haz clic para iniciar</p>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;