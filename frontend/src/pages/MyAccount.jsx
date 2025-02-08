import { useState, useEffect } from "react";
import { useAuthStore } from "../store/AuthStore.jsx";
import toast, { Toaster } from "react-hot-toast";
import Avatar from "react-avatar";
import Navbar from "../assets/components/NavBar.jsx";
import { FaUser, FaEnvelope, FaPhone, FaCity, FaVenusMars, FaCalendar, FaMapMarkerAlt, FaUserTag } from "react-icons/fa";
import { motion } from "framer-motion";

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

const MyAccount = () => {
  const { user, getAccountInfo, updateAccountInfo } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    birthdate: "",
    phone: "",
    city: "",
    gender: "",
    customGender: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenderChange = (e) => {
    const selectedGender = e.target.value;
    if (selectedGender === "custom") {
      setFormData({ ...formData, gender: "custom", customGender: "" });
    } else {
      setFormData({ ...formData, gender: selectedGender, customGender: "" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAccountInfo();
      } catch (error) {
        toast.error("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getAccountInfo]);

  useEffect(() => {
    if (user) {
      const isCustomGender = !genderOptions.some(option => option.value === user.gender);
      setFormData({
        name: user.name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        birthdate: user.birthdate || "",
        phone: user.phone || "",
        city: user.city || "",
        gender: isCustomGender ? "custom" : user.gender,
        customGender: isCustomGender ? user.gender : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalGender = formData.gender === "custom" ? formData.customGender : formData.gender;

    try {
      await updateAccountInfo({ ...formData, gender: finalGender });
      toast.success("Información de la cuenta actualizada");
    } catch (error) {
      toast.error("Error al actualizar la información de la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-[#0D0D0D]"
      >
        <p className="text-gray-400 animate-pulse">Cargando datos...</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      id="container" className="flex flex-col min-h-screen bg-[#101010]"
    >
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-8">
        <Toaster position="top-center" />
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1A1A1A] rounded-xl p-6 flex flex-col items-center w-full md:w-1/3 shadow-2xl"
        >
          <div className="relative">
            <Avatar name={formData.name} size="100" round={true} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white text-center">
            {formData.name || "Usuario"}
          </h2>
          <p className="mt-1 text-gray-400 text-sm text-center">
            {formData.email}
          </p>
          <div className="mt-4 text-gray-400 text-sm text-center space-y-2">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <p>
                <strong className="text-gray-400">Ciudad:</strong>{" "}
                <span className="text-white">{formData.city || "No especificada"}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaVenusMars className="text-gray-400" />
              <p>
                <strong className="text-gray-400">Género:</strong>{" "}
                <span className="text-white">
                  {formData.gender === "custom" ? formData.customGender : formData.gender || "No especificado"}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FaUserTag className="text-gray-400" />
              <p>
                <strong className="text-gray-400">Miembro desde:</strong>{" "}
                <span className="text-white">{new Date(user?.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>
        </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1A1A1A] rounded-xl p-6 w-full md:w-2/3 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaUser className="text-gray-400" /> Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black transition text-sm"
                    placeholder="Ingresa tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaUser className="text-gray-400" /> Apellido
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black text-sm"
                    placeholder="Ingresa tu apellido"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black text-sm"
                    placeholder="Ingresa tu correo"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaPhone className="text-gray-400" /> Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black text-sm"
                    placeholder="Ingresa tu teléfono"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaCity className="text-gray-400" /> Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black text-sm"
                    placeholder="Ingresa tu ciudad"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaVenusMars className="text-gray-400" /> Género
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleGenderChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black text-sm"
                  >
                    <option value="" disabled>Selecciona tu género</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.gender === "custom" && (
                  <div className="md:col-span-2">
                    <label htmlFor="customGender" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                      <FaVenusMars className="text-gray-400" /> Especifica tu género
                    </label>
                    <input
                      type="text"
                      id="customGender"
                      name="customGender"
                      value={formData.customGender}
                      onChange={(e) => setFormData({ ...formData, customGender: e.target.value })}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-black text-sm"
                      placeholder="Escribe tu género"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                  <FaCalendar className="text-gray-400" /> Fecha de Nacimiento
                </label>
                <input
                  type="text"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full bg-gray-300 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 cursor-not-allowed text-sm"
                  placeholder="Fecha de Nacimiento"
                />
              </div>

              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-100 transition duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyAccount;