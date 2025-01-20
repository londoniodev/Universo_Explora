import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaQuoteLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "./PasswordStrenghtMeter.jsx";
import { useAuthStore } from "../store/AuthStore.jsx";
import toast from "react-hot-toast";
import Boy from "../assets/images/astro_boy.png";
import NightLight from "../assets/images/nightlight.png";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [last_name, setLast_name] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const validateBirthdate = () => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      age < 14 ||
      (age === 14 && monthDifference < 0) ||
      (age === 14 && monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBirthdate()) {
      toast.error("Lo sentimos. Debes tener al menos 14 años para registrarte.");
      return;
    }

    setIsLoading(true);

    try {
      await signup(name, last_name, birthdate, phone, city, gender, email, password);
      toast.success("Te has registrado correctamente");
      toast("Verifica tu correo, hemos enviado un código para activar tu cuenta", {
        icon: "📧",
      });
      setTimeout(() => {
        navigate("/verify-code");
      }, 2500);
    } catch (error) {
      toast.error("Error al registrarse. Intenta nuevamente.");
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3, yoyo: Infinity } },
  };

  const lightAnimation = {
    animate: {
      x: [0, 50, -50, 0],
      y: [0, -30, 30, 0],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  };

  return (
    <div id="container" className="flex justify-center min-h-screen items-center px-4 relative overflow-hidden">
      <img
        src={NightLight}
        alt="Light"
        className="absolute z-1 inset-0 h-[50%] top-[50%] w-full pointer-events-none"
      />
      {/* Lights */}
      <motion.div
        className="absolute top-[20%] left-[15%] w-[200px] h-[200px] bg-gradient-to-br from-purple-800/50 to-transparent rounded-full blur-2xl"
        {...lightAnimation}
      />
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-[150px] h-[150px] bg-gradient-to-br from-blue-500/50 to-transparent rounded-full blur-3xl"
        {...lightAnimation}
      />

      <motion.div
        className="flex flex-col md:flex-row w-full z-10 max-w-7xl bg-transparent shadow-lg rounded-2xl overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
          variants={itemVariants}
        >
          <img
            src={Boy}
            alt="Astro Boy Background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <h1 className="text-xl lg:text-2xl font-bold text-white text-center p-4">
              <FaQuoteLeft className="inline-block mr-2" />
              Eres la razón de nuestro trabajo diario. ¡Gracias por elegirnos!
            </h1>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center bg-[#181818] md:w-1/2 w-full p-6 sm:px-8"
          variants={itemVariants}
        >
          <div className="max-w-lg mx-auto">
            <motion.h1
              className="text-xl sm:text-2xl font-bold text-white text-center"
              variants={itemVariants}
            >
              Todo comienza aquí
            </motion.h1>
            <motion.p
              className="text-sm sm:text-base text-white text-center mt-2"
              variants={itemVariants}
            >
              Crea tu cuenta ahora.
            </motion.p>
            <motion.form
              className="space-y-4 mt-4"
              onSubmit={handleSubmit}
              variants={containerVariants}
            >
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Número de Celular"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={itemVariants}
              >
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Seleccione su Género
                  </option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </motion.div>
              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <PasswordStrengthMeter password={password} />
              </motion.div>
              {error && (
                <motion.p
                  className="text-sm text-red-500 text-center"
                  variants={itemVariants}
                >
                  {error}
                </motion.p>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 flex items-center justify-center gap-2 text-white font-medium text-xl rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                variants={buttonVariants}
                whileHover="hover"
              >
                {isLoading ? "Registrando..." : <>Registrarme <FaUserPlus /></>}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;