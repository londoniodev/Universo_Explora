import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore.jsx';
import { Lock } from 'lucide-react';
import toast from "react-hot-toast";
import '../assets/css/forgot.css'

const RecoverPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { recoveryPassword } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      await recoveryPassword(token, password);
      toast.success('Contraseña cambiada correctamente. Redireccionando...');
      setTimeout(() => {
        navigate('/api/auth/login');
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Error al cambiar la contraseña. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id='container' className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Recuperar Contraseña
        </h1>
        <p className="text-center text-gray-600">
          Ingresa tu nueva contraseña para restablecer el acceso.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute z-10 ml-10 top-2 left-3 text-gray-400" />
            <input
              type="password"
              className="w-full ml-10 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute z-10 ml-10 top-2 left-3 text-gray-400" />
            <input
              type="password"
              className="w-full ml-10 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-3/4 ml-20 bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;