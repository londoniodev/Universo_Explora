import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaQuoteLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiSelector } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "./PasswordStrenghtMeter.jsx";
import { useAuthStore } from "../store/AuthStore.jsx";
import toast from "react-hot-toast";
import Logo from "../assets/images/logominimalistaExplorawhite.png";
import Light from "../assets/images/light.png";

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
  { value: "supersaiyan", label: "Super Saiyajin" },
  { value: "sith", label: "Sith" },
  { value: "jedi", label: "Jedi" },
  { value: "pokemon", label: "Pokémon" },
  { value: "digimon", label: "Digimon" },
  { value: "power-ranger", label: "Power Ranger" },
  { value: "hombre-arana", label: "Hombre Araña" },
  { value: "barbie", label: "Barbie" },
  { value: "buzz-lightyear", label: "Buzz Lightyear" },
  { value: "woody", label: "Woody" },
  { value: "shrek", label: "Shrek" },
  { value: "ogro", label: "Ogro" },
  { value: "princesa-disney", label: "Princesa Disney" },
  { value: "ninja-turtle", label: "Tortuga Ninja" },
  { value: "goku", label: "Goku" },
  { value: "mario-bros", label: "Mario Bros" },
  { value: "luigi", label: "Luigi" },
  { value: "sonic", label: "Sonic" },
  { value: "cyborg", label: "Cyborg" },
  { value: "robot", label: "Robot" },
  { value: "transhuman", label: "Transhumano" },
  { value: "android", label: "Android" },
  { value: "terreneitor", label: "Terreneitor" },
  { value: "terminator", label: "Terminator" },
  { value: "neon-genesis", label: "Evangelion" },
  { value: "matrix", label: "Matrix" },
  { value: "tron", label: "Tron" },
  { value: "helicoptero-apache", label: "Helicóptero Apache" },
  { value: "transbordador-espacial", label: "Transbordador Espacial" },
  { value: "patricio", label: "Patricio Estrella" },
  { value: "bob-esponja", label: "Bob Esponja" },
  { value: "krabby-patty", label: "Cangreburger" },
  { value: "sharingan", label: "Portador del Sharingan" },
  { value: "espartano", label: "Espartano (300)" },
  { value: "doomslayer", label: "Doom Slayer" },
  { value: "cheems", label: "Cheems" },
  { value: "doge", label: "Doge" },
  { value: "giga-chad", label: "Giga Chad" },
  { value: "meme-lord", label: "Señor de los Memes" },
  { value: "npc", label: "NPC" },
  { value: "viking", label: "Vikingo" },
  { value: "caballero-jedi", label: "Caballero Jedi" },
  { value: "filosofo-griego", label: "Filósofo Griego" },
  { value: "samurai", label: "Samurái" },
  { value: "pirata", label: "Pirata" },
  { value: "noble-medieval", label: "Noble Medieval" },
  { value: "templario", label: "Templario" },
  { value: "ninja", label: "Ninja" },
  { value: "galactic-entity", label: "Entidad Galáctica" },
  { value: "estrella-de-mar", label: "Estrella de Mar" },
  { value: "guardian-cosmico", label: "Guardián Cósmico" },
  { value: "alien", label: "Alienígena" },
  { value: "extraterrestre", label: "Extraterrestre" },
  { value: "ser-estelar", label: "Ser Estelar" },
  { value: "dimension-desconocida", label: "Ser de otra Dimensión" },
  { value: "cazador-de-mitos", label: "Cazador de Mitos" },
  { value: "yeti", label: "Yeti" },
  { value: "bigfoot", label: "Bigfoot" },
  { value: "kraken", label: "Kraken" },
  { value: "hamburguesa", label: "Hamburguesa" },
  { value: "taco", label: "Taco" },
  { value: "pan-con-queso", label: "Pan con Queso" },
  { value: "coffee-and-bread", label: "café con pan" },
  { value: "aguapanela", label: "Aguapanela" },
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
      setGender("custom");
      setCustomGender("");
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

    const finalGender = gender === "custom" ? customGender : gender;

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

  return (
    <div className="flex justify-center items-center min-h-screen px-4 md:px-8 bg-[#101828] relative overflow-hidden">
      <motion.img
        src={Light}
        alt="Logo de Explora"
        className="absolute z-0 w-[120%] h-[120%] rotate-[25deg] mt-[-15%] ml-[15%] pointer-events-none"
        loading="eager"
      />
      <motion.div
        className="flex flex-col md:flex-row w-full z-10 max-w-4xl lg:max-w-6xl bg-transparent overflow-hidden h-auto md:h-[38rem]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative h-[200px] md:h-full"
          variants={itemVariants}
        >
          <img
            src={Logo}
            alt="Logo de Explora"
            className="absolute inset-0 w-[30%] h-[30%] mx-auto mt-[30%] pointer-events-none my-auto z-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#020617] flex z-10 items-center justify-center">
            <h1 className="text-base mt-[50%] lg:text-lg font-bold text-white text-center p-2">
              <FaQuoteLeft className="inline-block text-white mr-2" />
              Eres la razón de nuestro trabajo diario. ¡Gracias por elegirnos!
            </h1>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center md:w-1/2 w-full p-4 sm:p-6 lg:p-8"
          variants={itemVariants}
        >

          <div className="max-w-sm md:max-w-md z-10 mt-[-2%] mx-auto">
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