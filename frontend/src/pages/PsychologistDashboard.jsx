import { useState, useEffect } from "react";
import { FaUserFriends, FaClipboardList, FaCalendarAlt, FaEnvelope, FaChartLine } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore.jsx";
import axios from "axios";
import toast from "react-hot-toast";

const PsychologistDashboard = () => {

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [notes, setNotes] = useState({});
  
  useEffect(() => {
    if (activeSection === "patients") fetchAssignedUsers();
    if (activeSection === "requests") fetchPendingRequests();
  }, [activeSection]);
  

  const fetchAssignedUsers = async () => {
    try {
      const response = await axios.get("/api/psychologist/dashboard", { withCredentials: true });
  
      if (response.data.success) {
        setAssignedUsers(response.data.assignedUsers || []);
      } else {
        throw new Error("No se encontraron usuarios asignados.");
      }
    } catch (error) {
      console.error("❌ Error al obtener usuarios asignados:", error);
      toast.error("Error al obtener los usuarios asignados.");
    }
  };
  

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get("/api/psychologist/pending-requests", { withCredentials: true });
      setPendingRequests(response.data.requests);
    } catch (error) {
      toast.error("Error al obtener solicitudes pendientes.");
    }
  };
  
  const handleRequestResponse = async (requestId, action) => {
    try {
      await axios.post("/api/psychologist/respond-request", { requestId, action }, { withCredentials: true });
      toast.success(`Solicitud ${action === "accept" ? "aceptada" : "rechazada"} correctamente.`);
      fetchPendingRequests();
      fetchAssignedUsers(); // 🔥 Actualiza la lista de pacientes
    } catch (error) {
      toast.error("Error al procesar la solicitud.");
    }
  };
  
  

  const handleSaveNote = async (userId) => {
    try {
      await axios.post("/api/psychologist/save-note", { userId, note: notes[userId] }, { withCredentials: true }); // 🔥 Ruta corregida
      toast.success("Nota guardada correctamente.");
    } catch (error) {
      toast.error("Error al guardar la nota.");
    }
  };
  

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
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Lista de Pacientes</h2>
            {assignedUsers.length === 0 ? (
              <p>No tienes pacientes asignados aún.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Nombre</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                    <th className="border border-gray-300 px-4 py-2">Progreso</th>
                    <th className="border border-gray-300 px-4 py-2">Notas</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.map((u) => (
                    <tr key={u._id || u.id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {u.name} {u.last_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {u.testProgress
                          ? `Contextualización: ${u.testProgress.contextualization}, Autoevaluación: ${u.testProgress.autoevaluation}, 16PF: ${u.testProgress.sixteenPF}`
                          : "No hay datos"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <textarea
                          className="w-full border p-2"
                          placeholder="Escribe una nota..."
                          value={notes[u._id] || ""}
                          onChange={(e) => setNotes({ ...notes, [u._id]: e.target.value })}
                        />
                        <button
                          onClick={() => handleSaveNote(u._id)}
                          className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          Guardar Nota
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
  
        case "requests":
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Solicitudes Pendientes</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-600">No hay solicitudes pendientes.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Usuario</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((req) => {
                      const user = req.userId || {}; // 🔥 Evita errores si `userId` es null
                      return (
                        <tr key={req._id} className="text-center">
                          <td className="border border-gray-300 px-4 py-2">
                            {user.name || "Desconocido"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {user.email || "No disponible"}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 flex flex-wrap gap-2 justify-center">
                            <button
                              onClick={() => handleRequestResponse(req._id, "accept")}
                              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => handleRequestResponse(req._id, "reject")}
                              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                            >
                              Rechazar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );

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
            { label: "Solicitudes Pendientes", icon: <FaClipboardList />, id: "requests" },
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