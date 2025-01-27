import { useState } from "react";
import { useAuthStore } from "../store/AuthStore.jsx";
import { ArrowLeft, Mail } from "lucide-react";
import Navbar from "../pages/Home_components/Home_navbar.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import '../assets/css/forgot.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { isLoading, forgotPassword } = useAuthStore();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success(
        "Verifica tu correo, hemos enviado un enlace para cambiar tu contraseña 📧"
      );
      setIsSubmitted(true);
    } catch (error) {
      toast.error("No hay un usuario registrado con este correo 😕");
    }
  };

  return (
    <div id="container" className="flex items-center justify-center min-h-screen w-full h-full">
      <Navbar/>
      <div className="bg-[#181818] text-center rounded-lg px-8 py-8">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="ml-auto text-center">
            <h1 className="text-3xl font-bold text-white">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="pt-2 pb-4 text-gray-300">
              Ingresa tu correo electrónico para restablecerla.
            </p>
            <div className="relative flex-col justify-center">
              <Mail className="absolute z-10 left-[2%] top-[50%] transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-[100%] pl-10 pr-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 text-white w-1/2 font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-indigo-500 text-3xl font-bold">
              ¡Correo enviado exitosamente!
            </p>
            <p className="text-white text-2xl">
              Revisa tu bandeja de entrada para continuar con el proceso de
              recuperación.📬
            </p>
          </div>
        )}
        <div className="mt-6 text-center">
          <Link
            to="/api/auth/login"
            className="inline-flex items-center text-blue-400 hover:underline"
          >
            <ArrowLeft className="mr-2" />
            Regresar al Inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;