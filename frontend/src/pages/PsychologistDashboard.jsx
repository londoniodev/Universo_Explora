import { useState, useEffect, useRef } from "react";
import { FaUserFriends, FaClipboardList, FaCalendarAlt, FaEnvelope, FaChartLine } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const PsychologistDashboard = () => {
  const { user, logout, fetchPsychologistAccountInfo, fetchAssignedUsers } = useAuthStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [newAssignedCount, setNewAssignedCount] = useState(0);
  const [notes, setNotes] = useState({});
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchPsychologistAccountInfo();
  
    const updateAssignedUsers = async () => {
      await fetchAssignedUsers();
      setAssignedUsers(useAuthStore.getState().assignedUsers || []);
    };

    updateAssignedUsers();
    fetchPendingRequests();
  }, []);
  

  useEffect(() => {
    if (user?._id) {
      if (!socketRef.current) {
        socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
          withCredentials: true,
          transports: ["websocket", "polling"],
        });
  
        socketRef.current.emit("join-psychologist-room", user._id);
  
        socketRef.current.on("new-request", async ({ userId }) => {
          try {
            const response = await axios.get(`/api/psychologist/pending-requests`, { withCredentials: true });
            if (response.data.success) {
              setPendingRequests(response.data.requests);
              setPendingRequestCount(response.data.requests.length);
            }
          } catch (error) {
            console.warn("⚠️ Error al obtener solicitudes tras notificación:", error);
          }
        });
  
        socketRef.current.on("request-removed", ({ userId }) => {
          setPendingRequests((prev) => prev.filter((req) => req.userId._id !== userId));
          setPendingRequestCount((prev) => Math.max(0, prev - 1));
        });
  
        socketRef.current.on("assigned-user", async ({ psychologistId, userId, message }) => {
          if (user?._id === psychologistId) {
            toast.dismiss();
            toast.success(`📢 ${message}`);
            
            await fetchAssignedUsers();
            setAssignedUsers(useAuthStore.getState().assignedUsers || []);
  
            setNewAssignedCount((prev) => prev + 1);
          }
        });
  
        socketRef.current.on("update-assigned-users", async () => {
          await fetchAssignedUsers();
          setAssignedUsers(useAuthStore.getState().assignedUsers || []);
        });
  
        socketRef.current.on("disconnect", () => {
          console.warn("⚠️ Desconectado del servidor de sockets.");
        });
      }
    }
  
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-psychologist-room", user._id);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);
  

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get("/api/psychologist/pending-requests", { withCredentials: true });
      if (response.data.success) {
        setPendingRequests(response.data.requests);
        setPendingRequestCount(response.data.requests.length);
      }
    } catch (error) {
      console.warn("⚠️ Error al obtener solicitudes pendientes:", error);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    try {
      await axios.post(`/api/psychologist/requests/respond`, { requestId, action }, { withCredentials: true });

      toast.success(`✅ Solicitud ${action === "accept" ? "aceptada" : "rechazada"} correctamente.`);
      
      if (action === "accept" && socketRef.current) {
        socketRef.current.emit("request-removed", { requestId });
      }

      await fetchAssignedUsers();
      await fetchPendingRequests();
    } catch (error) {
      toast.error("❌ Error al procesar la solicitud.");
    }
  };

  const handleSaveNote = async (userId) => {
    try {
      await axios.post("/api/psychologist/save-note", { userId, note: notes[userId] }, { withCredentials: true });
      toast.success("Nota guardada correctamente.");
    } catch (error) {
      toast.error("Error al guardar la nota.");
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.getItem("hasSeenWelcomeNotification");
    navigate("/api/auth/login");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4"></h2>
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
                    <tr key={req._id || req.userId}>
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
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
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
      <div className="w-1/5 bg-[#0E223F] text-white p-6">
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
              onClick={() => {
                setActiveSection(id);
                if (id === "patients") setNewAssignedCount(0);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                activeSection === id ? "bg-gradient-to-r from-[#3B48B4] to-[#345AC3]" : "hover:bg-gradient-to-r from-[#3B48B4] to-[#345AC3]"
              }`}
            >
              {icon}
              {label}

              {id === "patients" && newAssignedCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {newAssignedCount}
                </span>
              )}

              {id === "requests" && pendingRequestCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {pendingRequestCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 bg-[#142946]">
        <div className="flex items-center justify-between bg-[#142946] p-4">
          <h1 className="text-xl font-bold">Dashboard del Psicólogo</h1>

          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <h1 className="text-gray-300">¡Hola, <span className="text-white font-medium">{user?.name}</span>!</h1>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                {user?.profilePicture ? (
                  <img 
                    src={user?.profilePicture && user.profilePicture.includes("cloudinary") 
                      ? user.profilePicture 
                      : "https://res.cloudinary.com/dkandom0b/image/upload/v1739941412/explora_xnqod9.png"}
                    alt="Foto de perfil" 
                    className="w-full h-full rounded-full object-cover pointer-events-none bg-[#101010]"
                    onError={(e) => { 
                      console.warn("⚠️ Error cargando la imagen:", e.target.src);
                      e.target.src = "https://res.cloudinary.com/dkandom0b/image/upload/v1739941412/explora_xnqod9.png"; 
                    }} 
                  />
                ) : (
                  <span className="text-gray-700 dark:text-gray-200 font-bold text-4xl">
                    {user?.name?.charAt(0)}
                  </span>
                )}
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <button
                  onClick={() => navigate("/api/auth/psychologist-dashboard/my-account")}
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