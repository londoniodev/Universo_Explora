import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore.jsx";
import Navbar from "../assets/components/home/Home_navbar.jsx";
import { Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import "../assets/css/forgot.css";

const PasswordInput = ({
  label,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  placeholder,
}) => (
  <div className="relative">
    <Lock className="absolute left-3 top-2.5 text-white z-20" aria-hidden="true" />
    <input
      type={showPassword ? "text" : "password"}
      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none bg-transparent backdrop-blur-md text-white"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      aria-label={label}
    />
    {showPassword ? (
      <EyeOff
        className="absolute right-3 top-2.5 text-purple-600 cursor-pointer"
        onClick={toggleShowPassword}
        aria-hidden="true"
      />
    ) : (
      <Eye
        className="absolute right-3 top-2.5 text-purple-600 cursor-pointer"
        onClick={toggleShowPassword}
        aria-hidden="true"
      />
    )}
  </div>
);

const RecoverPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { recoveryPassword } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    try {
      setIsLoading(true);
      await recoveryPassword(token, password);
      toast.success("Contraseña cambiada correctamente. Redireccionando...");
      setTimeout(() => {
        navigate("/api/auth/login");
      }, 3000);
    } catch (error) {
      toast.error(error.message || "Error al cambiar la contraseña. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <Navbar />
      <div id="container" className="min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-80">
        <div className="absolute top-0 left-[15%] w-[20rem] h-[20rem] rounded-full z-10 bg-cyan-400 blur-[150px]"></div>
        <div className="absolute bottom-[15%] right-[15%] w-[20rem] h-[20rem] z-10 rounded-full bg-purple-400 blur-[150px]"></div>
        <div className="w-full max-w-xl bg-[rgba(27,27,27,0.3)] backdrop-blur-[40px] border z-20 border-white/20 shadow-lg rounded-2xl p-8 space-y-6">

          <h1 className="text-2xl font-bold text-center text-white">
            Recuperar Contraseña
          </h1>
          <p className="text-center text-gray-200">
            Ingresa tu nueva contraseña para restablecer el acceso.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              label="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword((prev) => !prev)}
              placeholder="Nueva contraseña"
            />
            <PasswordInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword((prev) => !prev)}
              placeholder="Confirma tu nueva contraseña"
            />
            <button
              type="submit"
              className={`w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Restablecer Contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;