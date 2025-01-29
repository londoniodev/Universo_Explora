import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaQuoteLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiSelector } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "./PasswordStrenghtMeter.jsx";
import { useAuthStore } from "../store/AuthStore.jsx";
import toast from "react-hot-toast";
import Boy from "../assets/images/astro_boy.png";
import NightLight from "../assets/images/nightlight.png";


const genderOptions = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Femenino" },
  { value: "nonbinary", label: "No binario" },
  { value: "genderqueer", label: "Genderqueer" },
  { value: "transgender", label: "Transgénero" },
  { value: "agender", label: "Agénero" },
  { value: "bigender", label: "Bígénero" },
  { value: "genderfluid", label: "Genderfluid" },
  { value: "demiboy", label: "Demiboy" },
  { value: "demigirl", label: "Demigirl" },
  { value: "androgyne", label: "Andrógino" },
  { value: "two-spirit", label: "Dos espíritus (Two-Spirit)" },
  { value: "neutrois", label: "Neutrois" },
  { value: "pangender", label: "Pangénero" },
  { value: "polygender", label: "Poligénero" },
  { value: "cisgender", label: "Cisgénero" },
  { value: "intersex", label: "Intersex" },
  { value: "prefer not to say", label: "Prefiero no decirlo" },
  { value: "custom", label: "Especificar otro género" },
];

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [last_name, setLast_name] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [customGender, setCustomGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    
    if (selectedGender === "custom") {
      setGender("");
    }else{
      setGender(selectedGender);
      setCustomGender("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBirthdate()) {
      toast.error("Lo sentimos. Debes tener al menos 14 años para registrarte.");
      return;
    }

    setIsLoading(true);

    const finalGender = gender === "" ? customGender : gender;

    try {
      await signup(name, last_name, birthdate, phone, city, finalGender, email, password);
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
    <div id="container" className="flex justify-center items-center min-h-screen px-4 md:px-8 bg-gray-50 relative overflow-hidden">
      <img
        src={NightLight}
        alt="Light"
        className="absolute z-1 inset-0 h-[50%] top-[50%] w-full pointer-events-none"
      />
      <motion.div
        className="absolute top-[20%] left-[15%] w-[150px] h-[150px] bg-gradient-to-br from-purple-800/50 to-transparent rounded-full blur-2xl"
        {...lightAnimation}
      />
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-[100px] h-[100px] bg-gradient-to-br from-blue-500/50 to-transparent blur-3xl"
        {...lightAnimation}
      />

      <motion.div
        className="flex flex-col md:flex-row w-full z-10 max-w-4xl lg:max-w-6xl bg-transparent border border-white/20 shadow-lg overflow-hidden h-auto md:h-[38rem]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative h-[200px] md:h-full"
          variants={itemVariants}
        >
          <img
            src={Boy}
            alt="Astro Boy Background"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <h1 className="text-base lg:text-lg font-bold text-white text-center p-2">
              <FaQuoteLeft className="inline-block mr-2" />
              Eres la razón de nuestro trabajo diario. ¡Gracias por elegirnos!
            </h1>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center bg-[#101010]/20 md:w-1/2 w-full p-4 sm:p-6 lg:p-8 backdrop-blur-lg border-white/10 shadow-lg"
          variants={itemVariants}
        >
          <div className="max-w-sm md:max-w-md mt-[-2%] mx-auto">
            <motion.h1
              className="text-base sm:text-2xl font-bold text-white text-center"
              variants={itemVariants}
            >
              Todo comienza aquí
            </motion.h1>
            <motion.p
              className="text-xs sm:text-sm text-white text-center mt-1"
              variants={itemVariants}
            >
              Crea tu cuenta ahora.
            </motion.p>
            <motion.form
              className="space-y-2 mt-3"
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
                  className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Número de Celular"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
              <motion.div
                className="grid grid-cols-1.5 sm:grid-cols-2 gap-2"
                variants={itemVariants}
              >
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                  <select
                    value={gender}
                    onChange={handleGenderChange}
                    required
                    className="w-full px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Seleccione su Género
                    </option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <HiSelector className="w-5 h-5" />
                  </div>
                </div>
                {gender === "custom" && (
                  <input
                    type="text"
                    placeholder="Escriba su género"
                    value={customGender}
                    onChange={(e) => setCustomGender(e.target.value)}
                    className="w-96 px-2 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </motion.div>
              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-2 py-1.5 text-[90%] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 inset-y-0 flex items-center text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <PasswordStrengthMeter password={password} />
              </motion.div>
              {error && (
                <motion.p
                  className="text-xs text-red-500 text-center"
                  variants={itemVariants}
                >
                  {error}
                </motion.p>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 flex items-center justify-center gap-2 text-white font-medium text-sm md:text-base rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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