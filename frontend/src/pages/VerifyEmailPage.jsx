import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore.jsx";
import { FaCheck } from "react-icons/fa6";
import toast from "react-hot-toast";
import '../assets/css/forgot.css'

const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { verifyCode } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").slice(0, 6);

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < newCode.length) {
        newCode[i] = pastedData[i];
      }
    }

    setCode(newCode);
    inputRefs.current[pastedData.length - 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      toast.error("Por favor, completa el código de verificación.");
      setIsLoading(false);
      return;
    }

    try {
      await verifyCode(verificationCode);
      toast.success("Correo verificado correctamente, redireccionando...");
      setTimeout(() => {
        navigate("/api/auth/login");
      }, 2500);
    } catch (error) {
      toast.error("Error verificando el código. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      inputRefs.current[5]?.blur();
    }
  }, [code]);

  const isButtonDisabled = isLoading || code.some((digit) => digit === "");

  return (
    <div id="container" className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#181818] shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-white text-center mb-4">
          Ingresar código de verificación.
        </h1>
        
        <p className="text-center text-white mb-6">
          Ingresa el código de verificación que te enviamos.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-2 -ml-16">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center ml-16 text-2xl bg-gray-600 text-bold text-white rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`items-center text-center w-full justify-center py-3 text-white font-semibold rounded-lg transition ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin border-t-2 border-white rounded-full w-6 h-6 mx-auto"></div>
            ) : (
              <span className="flex items-center justify-center">
                Verificar <FaCheck className="ml-2" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
