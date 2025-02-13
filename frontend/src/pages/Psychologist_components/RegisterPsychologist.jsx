import { useState } from "react";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import Select from "react-select"; // Importar react-select
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../PasswordStrenghtMeter.jsx";
import { useAuthStore } from "../../store/AuthStore.jsx";
import toast from "react-hot-toast";
import "country-flag-icons/3x2/flags.css"; // Estilos para las banderas

// Lista de códigos de país con banderas y longitudes
const countryCodes = [
  { code: "+57", country: "Colombia", flag: "CO", length: 10 },
  { code: "+52", country: "México", flag: "MX", length: 10 },
  { code: "+1", country: "Estados Unidos", flag: "US", length: 10 },
  { code: "+34", country: "España", flag: "ES", length: 9 },
  { code: "+54", country: "Argentina", flag: "AR", length: 10 },
  // Agrega más códigos de país aquí...
];

const RegisterPsychologist = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    birthdate: "",
    phoneCode: "+57", // Código de país por defecto
    phoneNumber: "", // Número de teléfono
    city: "",
    gender: "",
    email: "",
    password: "",
    idCardNumber: "",
    experienceYears: "",
    profilePicture: null,
    degreeCertificate: null,
    professionalCard: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { registerPsychologist } = useAuthStore();

  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejo de archivos
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  // Manejo de cambios en el código de país
  const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, phoneCode: selectedOption.value }));
  };

  // Validación y envío
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica la edad
    if (new Date().getFullYear() - new Date(formData.birthdate).getFullYear() < 18) {
      toast.error("Debes ser mayor de 18 años");
      return;
    }

    // Obtén el país seleccionado
    const selectedCountry = countryCodes.find(
      (country) => country.code === formData.phoneCode
    );

    // Verifica la longitud del número de teléfono
    if (formData.phoneNumber.length !== selectedCountry.length) {
      toast.error(`El número de teléfono debe tener ${selectedCountry.length} dígitos`);
      return;
    }

    // Combina el código de país y el número de teléfono
    const fullPhoneNumber = `${formData.phoneCode}${formData.phoneNumber}`;

    setIsLoading(true);
    const finalFormData = new FormData();
    
    Object.entries({
      ...formData,
      phone: fullPhoneNumber, // Envía el número completo
    }).forEach(([key, value]) => value && finalFormData.append(key, value));

    try {
      await registerPsychologist(finalFormData);
      toast.success("Registro exitoso. Espera aprobación.");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Error en registro");
    } finally {
      setIsLoading(false);
    }
  };

  // Opciones para el selector de códigos de país
  const countryOptions = countryCodes.map((country) => ({
    value: country.code,
    label: (
      <div className="flex items-center">
        <span className={`fi fi-${country.flag.toLowerCase()} mr-2`}></span>
        <span>{country.code} ({country.country})</span>
      </div>
    ),
  }));

  return (
    <div id="container" className="min-h-screen flex items-center justify-center p-4">
      <div className="w-[70%] bg-[#202020] rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-100 text-center mb-8">
          Registro de Psicólogo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-100 border-b pb-2">
              Información Personal
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Apellido"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Fecha de Nacimiento"
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">
                  Teléfono
                </label>
                <div className="flex gap-2">
                    {/* Selector de código de país con banderas */}
                    <Select
                        options={countryOptions}
                        value={countryOptions.find(
                        (option) => option.value === formData.phoneCode
                        )}
                        onChange={handleCountryChange}
                        className="w-full md:w-72" // Responsivo
                        classNamePrefix="react-select"
                        styles={{
                        control: (base) => ({
                            ...base,
                            border: "1px solid #e2e8f0",
                            borderRadius: "0.5rem",
                            padding: "0.5rem", // Más padding
                            boxShadow: "none",
                            "&:hover": {
                            borderColor: "#e2e8f0",
                            },
                        }),
                        menu: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            marginTop: "0.5rem",
                        }),
                        option: (base, { isFocused, isSelected }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#3b82f6" : isSelected ? "#3b82f6" : "white",
                            color: isFocused || isSelected ? "white" : "#1a1a1a",
                            "&:active": {
                            backgroundColor: "#3b82f6",
                            },
                        }),
                        }}
                    />
                    {/* Input para el número de teléfono */}
                    <input
                        type="number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Número de teléfono"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    </div>
              </div>
              <InputField
                label="Ciudad"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-600">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>Seleccionar...</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección de Credenciales */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Credenciales
            </h2>
            
            <InputField
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <PasswordStrengthMeter password={formData.password} />
            </div>

            <InputField
              label="Número de Cédula"
              name="idCardNumber"
              value={formData.idCardNumber}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Años de Experiencia"
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              required
            />
          </div>

          {/* Sección de Documentos */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Documentos Requeridos
            </h2>
            
            <FileUpload
              label="Foto de Perfil"
              name="profilePicture"
              onChange={handleFileChange}
              required
            />
            <FileUpload
              label="Acta de Grado"
              name="degreeCertificate"
              onChange={handleFileChange}
              required
            />
            <FileUpload
              label="Tarjeta Profesional"
              name="professionalCard"
              onChange={handleFileChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? "Procesando..." : "Completar Registro"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente reutilizable para inputs
const InputField = ({ label, type = "text", name, value, onChange, required }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required={required}
    />
  </div>
);

// Componente para subida de archivos
const FileUpload = ({ label, name, onChange, required }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-600">
      {label}
    </label>
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <FaUpload className="inline mr-2 text-gray-600" />
        Seleccionar archivo
      </span>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="hidden"
        required={required}
      />
    </label>
  </div>
);

export default RegisterPsychologist;