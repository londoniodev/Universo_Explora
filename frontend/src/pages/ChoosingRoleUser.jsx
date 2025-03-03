import { Link } from 'react-router-dom';
import { FaUser, FaBrain } from 'react-icons/fa';

const ChoosingRoleUser = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000000] text-white relative overflow-hidden">
      <div className="text-center z-10">
        <h1 className="text-4xl font-bold mb-4">Elige tu cuenta</h1>
        <p className="text-lg text-gray-400 mb-12">
          Selecciona el tipo de cuenta que deseas crear.
        </p>

        <div className="flex space-x-8">
          <Link
            to="/api/auth/users/signup"
            className="flex flex-col items-center p-10 bg-[#121212] rounded-2xl shadow-lg hover:bg-[#1E1E1E] transition-all duration-300 border border-[#383838]"
          >
            <div className="p-5 bg-[#1E1E1E] rounded-full mb-6">
              <FaUser className="text-5xl text-[#BB86FC]" />
            </div>
            <span className="text-2xl font-semibold">Usuario</span>
            <p className="text-sm text-gray-400 mt-2">
              Regístrate como usuario
            </p>
          </Link>

          <Link
            to="/api/auth/psychologist/signup"
            className="flex flex-col items-center p-10 bg-[#121212] rounded-2xl shadow-lg hover:bg-[#1E1E1E] transition-all duration-300 border border-[#383838]"
          >
            <div className="p-5 bg-[#1E1E1E] rounded-full mb-6">
              <FaBrain className="text-5xl text-[#03DAC6]" />
            </div>
            <span className="text-2xl font-semibold">Psicólogo</span>
            <p className="text-sm text-gray-400 mt-2">
              Regístrate como psicólogo
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChoosingRoleUser;