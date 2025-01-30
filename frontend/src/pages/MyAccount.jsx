import { useState, useEffect } from "react";
import { useAuthStore } from "../store/AuthStore.jsx";
import toast, { Toaster } from "react-hot-toast";
import Avatar from "react-avatar";
import Navbar from "../assets/components/NavBar.jsx";
import { FaUser, FaEnvelope, FaPhone, FaCity, FaVenusMars, FaCalendar, FaEdit } from "react-icons/fa";

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
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <p className="text-gray-400 animate-pulse">Cargando datos...</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-8">
        <Toaster position="top-center" />
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          {/* Tarjeta izquierda: Avatar, nombre y correo */}
          <div className="bg-[#1A1A1A] rounded-xl p-8 flex flex-col items-center w-full md:w-1/3">
            <div className="relative">
              <Avatar name={formData.name} size="120" round={true} className="border-4 border-[#4F46E5]" />
              <button className="absolute bottom-2 right-2 bg-[#4F46E5] p-2 rounded-full hover:bg-[#9333EA] transition duration-300">
                <FaEdit className="text-white" />
              </button>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white text-center">
              {formData.name || "Usuario"}
            </h2>
            <p className="mt-2 text-gray-400 text-sm text-center">
              {formData.email}
            </p>
            <div className="mt-4 text-gray-400 text-sm text-center">
              <p><strong>Ciudad:</strong> {formData.city || "No especificada"}</p>
              <p><strong>Género:</strong> {formData.gender === "custom" ? formData.customGender : formData.gender || "No especificado"}</p>
              <p><strong>Miembro desde:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Tarjeta derecha: Formulario de edición */}
          <div className="bg-[#1A1A1A] rounded-xl p-8 w-full md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaUser className="text-[#4F46E5]" /> Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                    placeholder="Ingresa tu nombre"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaUser className="text-[#4F46E5]" /> Apellido
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                    placeholder="Ingresa tu apellido"
                  />
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaEnvelope className="text-[#4F46E5]" /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                    placeholder="Ingresa tu correo"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaPhone className="text-[#4F46E5]" /> Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                    placeholder="Ingresa tu teléfono"
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaCity className="text-[#4F46E5]" /> Ciudad
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                    placeholder="Ingresa tu ciudad"
                  />
                </div>

                {/* Género */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                    <FaVenusMars className="text-[#4F46E5]" /> Género
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleGenderChange}
                    className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                  >
                    <option value="" disabled>Selecciona tu género</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Campo personalizado para género */}
                {formData.gender === "custom" && (
                  <div className="md:col-span-2">
                    <label htmlFor="customGender" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                      <FaVenusMars className="text-[#4F46E5]" /> Especifica tu género
                    </label>
                    <input
                      type="text"
                      id="customGender"
                      name="customGender"
                      value={formData.customGender}
                      onChange={(e) => setFormData({ ...formData, customGender: e.target.value })}
                      className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition duration-200"
                      placeholder="Escribe tu género"
                    />
                  </div>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-400 flex items-center gap-2">
                  <FaCalendar className="text-[#4F46E5]" /> Fecha de Nacimiento
                </label>
                <input
                  type="text"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  disabled
                  className="mt-1 block w-full bg-[#0D0D0D] border border-gray-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                  placeholder="Fecha de Nacimiento"
                />
              </div>

              {/* Botón de guardar */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white font-semibold rounded-lg hover:from-[#9333EA] hover:to-[#4F46E5] transition duration-300 shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;