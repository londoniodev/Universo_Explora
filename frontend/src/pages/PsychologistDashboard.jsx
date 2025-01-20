import { useState } from "react";
import { FaUserFriends, FaCalendarAlt, FaEnvelope, FaChartLine } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore.jsx";

const PsychologistDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("hasSeenWelcomeNotification");
    navigate("/api/auth/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Bienvenido, {user?.name}</h2>
            <p className="text-gray-600">Aquí puedes gestionar tus pacientes y actividades.</p>
          </div>
        );
      case "patients":
        return <div>Lista de Pacientes</div>;
      case "calendar":
        return <div>Calendario</div>;
      case "messages":
        return <div>Mensajes</div>;
      case "reports":
        return <div>Reportes</div>;
      default:
        return <div>Seleccione una sección</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/5 bg-blue-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav className="space-y-4">
          {[
            { label: "Dashboard", icon: <FaChartLine />, id: "dashboard" },
            { label: "Pacientes", icon: <FaUserFriends />, id: "patients" },
            { label: "Calendario", icon: <FaCalendarAlt />, id: "calendar" },
            { label: "Mensajes", icon: <FaEnvelope />, id: "messages" },
            { label: "Reportes", icon: <FaChartLine />, id: "reports" },
          ].map(({ label, icon, id }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                activeSection === id ? "bg-blue-700" : "hover:bg-blue-800"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 bg-gray-100">
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <h1 className="text-xl font-bold">Dashboard del Psicólogo</h1>
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <button
                  onClick={() => navigate("/my-account")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUserFriends className="inline mr-2" />
                  Mi Cuenta
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LuLogOut className="inline mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;