import { useState, useEffect } from "react";
import { useAuthStore } from "../store/AuthStore.jsx";
import toast, { Toaster } from "react-hot-toast";
import Avatar from "react-avatar";
import Navbar from "../assets/components/NavBar.jsx";

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
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setFormData({
        name: user.name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        birthdate: user.birthdate || "",
        phone: user.phone || "",
        city: user.city || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateAccountInfo(formData);
      toast.success("Información de la cuenta actualizada");
    } catch (error) {
      toast.error("Error al actualizar la información de la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br pt-[6%] from-black via-gray-900 to-black flex flex-col items-center">
        <Toaster position="top-center" />
        <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-3xl mt-8">
          <div className="flex flex-col items-center mb-6">
            <Avatar name={formData.name} size="100" round={true} className="shadow-lg" />
            <h2 className="mt-4 text-2xl font-semibold text-white">{formData.name || "Usuario"}</h2>
            <p className="text-gray-400">{formData.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white placeholder-gray-500"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-400">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white placeholder-gray-500"
                  placeholder="Apellido"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white placeholder-gray-500"
                  placeholder="Correo"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-400">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white placeholder-gray-500"
                  placeholder="Teléfono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-400">
                  Ciudad
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white placeholder-gray-500"
                  placeholder="Ciudad"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-400">
                  Género
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white"
                >
                  <option value="" disabled>
                    Selecciona tu género
                  </option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-400">
                Fecha de Nacimiento
              </label>
              <input
                type="String"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                disabled={true}
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 bg-gray-900 text-white placeholder-gray-500"
                placeholder="Fecha de Nacimiento"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300 shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;