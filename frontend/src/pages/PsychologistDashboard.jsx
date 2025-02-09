import { useState, useEffect } from "react";
import { FaUserFriends, FaClipboardList, FaCalendarAlt, FaEnvelope, FaChartLine } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// 🔥 Conectar con `Socket.io`
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

const PsychologistDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [notes, setNotes] = useState({});

  // ✅ Unir al psicólogo a su sala de `Socket.io`
  useEffect(() => {
    if (user?._id) {
      socket.emit("join-psychologist-room", user._id);
      console.log(`📡 Uniendo al psicólogo ${user._id} a su sala...`);
    }
  }, [user?._id]);

  // ✅ Cargar datos al iniciar
  useEffect(() => {
    fetchAssignedUsers();
    fetchPendingRequests();
  }, []);

  // ✅ Escuchar eventos en tiempo real con `Socket.io`
  useEffect(() => {
    const updatePendingRequests = async () => await fetchPendingRequests();
    const updateAssignedUsers = async () => await fetchAssignedUsers();

    socket.on("new-request", updatePendingRequests);
    socket.on("request-removed", ({ userId }) => {
      setPendingRequests((prevRequests) => prevRequests.filter(req => req.userId !== userId));
      setPendingRequestCount((prevCount) => Math.max(0, prevCount - 1));
    });

    socket.on("assigned-user", ({ psychologistId }) => {
      if (psychologistId === user?._id) {
        updateAssignedUsers();
      }
    });

    return () => {
      socket.off("new-request", updatePendingRequests);
      socket.off("request-removed");
      socket.off("assigned-user", updateAssignedUsers);
    };
  }, [user?._id]);

  // ✅ Obtener pacientes asignados
  const fetchAssignedUsers = async () => {
    try {
      const response = await axios.get("/api/psychologist/dashboard", { withCredentials: true });
      setAssignedUsers(response.data.assignedUsers || []);
    } catch (error) {
      toast.error("Error al obtener los usuarios asignados.");
    }
  };

  // ✅ Obtener solicitudes pendientes
  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get("/api/psychologist/pending-requests", { withCredentials: true });
      setPendingRequests(response.data.requests);
      setPendingRequestCount(response.data.requests.length);
    } catch (error) {
      toast.error("Error al obtener solicitudes pendientes.");
    }
  };

  // ✅ Aceptar o rechazar solicitudes
  const handleRequestResponse = async (requestId, action) => {
    try {
      await axios.post("/api/psychologist/respond-request", { requestId, action }, { withCredentials: true });
      toast.success(`Solicitud ${action === "accept" ? "aceptada" : "rechazada"} correctamente.`);

      // 🔄 Actualizar listas en tiempo real
      await fetchAssignedUsers();
      await fetchPendingRequests();
    } catch (error) {
      toast.error("Error al procesar la solicitud.");
    }
  };

  // ✅ Guardar notas
  const handleSaveNote = async (userId) => {
    try {
      await axios.post("/api/psychologist/save-note", { userId, note: notes[userId] }, { withCredentials: true });
      toast.success("Nota guardada correctamente.");
    } catch (error) {
      toast.error("Error al guardar la nota.");
    }
  };

  // ✅ Cerrar sesión
  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("hasSeenWelcomeNotification");
    navigate("/api/auth/login");
  };

  // 🔥 Renderizar el contenido dinámico
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Bienvenido, {user?.name}</h2>
            <p className="text-gray-600">Aquí puedes gestionar tus pacientes y actividades.</p>
          </div>
        );

      case "requests":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Solicitudes Pendientes</h2>
            {pendingRequests.length === 0 ? (
              <p>No hay solicitudes pendientes.</p>
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
                  {pendingRequests.map((req) => (
                    <tr key={req._id}>
                      <td className="border border-gray-300 px-4 py-2">{req.userId?.name || "Desconocido"}</td>
                      <td className="border border-gray-300 px-4 py-2">{req.userId?.email || "No disponible"}</td>
                      <td className="border border-gray-300 px-4 py-2 flex gap-2">
                        <button onClick={() => handleRequestResponse(req._id, "accept")} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
                          Aceptar
                        </button>
                        <button onClick={() => handleRequestResponse(req._id, "reject")} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

        case "patients":
          return (
            <div>
              <h2 className="text-2xl font-bold mb-4">Pacientes Asignados</h2>
              {assignedUsers.length === 0 ? (
                <p>No tienes pacientes asignados.</p>
              ) : (
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Nombre</th>
                      <th className="border border-gray-300 px-4 py-2">Email</th>
                      <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                            Ver Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
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
      {/* 📌 Sidebar */}
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

              {/* 🔴 Indicador de notificaciones en "Solicitudes Pendientes" */}
              {id === "requests" && pendingRequestCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {pendingRequestCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* 📌 Contenido Principal */}
      <div className="flex-1 bg-gray-100">
        {/* 📌 Header */}
        <div className="flex items-center justify-between bg-white p-4 shadow-md">
          <h1 className="text-xl font-bold">Dashboard del Psicólogo</h1>

          {/* 📌 Menú de Usuario */}
          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {/* 🧑‍⚕️ Avatar del usuario */}
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </button>

            {/* 🔽 Menú desplegable */}
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