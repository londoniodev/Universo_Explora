import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../assets/images/explora.png";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/AuthStore.jsx";
import Light from "../assets/images/light.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const user = await login(email, password);
  
      if (!user) { 
        console.warn("⚠️ No se recibió usuario válido después del login.");
        return;
      }
  
      if (user.isVerified === false && user.role !== "psychologist") {
        toast("Tu cuenta no está verificada. Revisa tu correo y confirma el código.", {
          icon: "📩",
          duration: 7000,
        });
  
        setTimeout(() => {
          navigate("/api/auth/verify-code");
        }, 3000);
        return;
      }
  
      if (user.role === "psychologist" && !user.isApproved) {
        toast("Tu cuenta está pendiente de aprobación. Recibirás un correo cuando sea validada.", {
          icon: "⏳",
          duration: 7000,
        });
  
        setTimeout(() => {
          navigate("/api/auth/login");
        }, 7000);
        return;
      }
  
      const redirectURL = user.role === "admin" ? "/api/auth/admin-dashboard"
        : user.role === "psychologist" ? "/api/auth/psychologist-dashboard"
        : "/api/auth/dashboard";
  
      navigate(redirectURL);
  
    } catch (error) {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };
  


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <div className="relative overflow-hidden bg-[#101828] min-h-screen">
      <motion.img
        src={Light}
        alt="Logo de Explora"
        className="absolute z-10 w-[120%] h-[120%] rotate-[20deg] mt-[-10%] opacity-70 ml-[-30%] pointer-events-none"
        loading="eager"
      />

      <motion.img
        src={Light}
        alt="Logo de Explora"
        className="absolute z-10 w-[120%] h-[120%] rotate-[120deg] mt-[-10%] opacity-70 ml-[30%] pointer-events-none"
        loading="eager"
      />

      <motion.div
        className="flex items-center justify-center bg-[#101828] min-h-screen relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        <motion.div
          className="w-full max-w-md bg-transparent p-8 relative z-20"
          variants={itemVariants}
        >
          <motion.img
            src={Logo}
            alt="Logo"
            className="w-[18%] h-[18%] mx-auto pointer-events-none"
            variants={itemVariants}
          />
          <motion.h1 className="text-3xl font-bold text-center text-white" variants={itemVariants}>
            Accede a tu cuenta
          </motion.h1>
          <motion.form className="space-y-6 mt-6" onSubmit={handleLogin} variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
              />
            </motion.div>
            <motion.div className="relative" variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 rounded-md bg-transparent border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-9 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/api/auth/forgot-password"
                className="block text-sm text-[#6589FF] font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </motion.div>
            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-[#615FFF] text-white rounded-md hover:bg-[#4F4CFF] focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105"
              disabled={isLoading}
              variants={itemVariants}
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </motion.button>
          </motion.form>
          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <p className="text-sm text-gray-400">
              ¿No tienes una cuenta?{" "}
              <Link to="/api/auth/choose-role" className="text-[#6589FF] font-semibold">
                Registrarme
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
    
  );
};

export default LoginPage;