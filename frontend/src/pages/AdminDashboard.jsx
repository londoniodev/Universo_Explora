import { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserShield, FaSearch, FaUserCheck, FaUsers, FaChartBar, FaExchangeAlt } from "react-icons/fa";
import UserManagement from "../assets/components/admin/UserManagement.jsx";
import PsychologistAssignment from "../assets/components/admin/PsychologistAssignment.jsx";
import PendingRequests from "../assets/components/admin/PendingRequests.jsx";
import PsychologistManagement from "../assets/components/admin/PsychologistManagement.jsx";
import PsychologistReports from "../assets/components/admin/PsychologistReports.jsx";
import PsychologistReassignment from "../assets/components/admin/PsychologistReassignment.jsx";

const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, psychologistsResponse, requestsResponse] = await Promise.all([
        axios.get("/api/admin/users", { withCredentials: true }),
        axios.get("/api/admin/psychologists", { withCredentials: true }),
      ]);
      setUsers(usersResponse.data.users);
      setPsychologists(psychologistsResponse.data.psychologists);
      setPendingRequests(requestsResponse);
    } catch (error) {
      toast.error("Error al cargar los datos.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/api/auth/login");
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="flex justify-between items-center bg-blue-600 p-4 text-white rounded-lg shadow-lg mb-5">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaUserShield /> Panel de Administración
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-600 transition"
        >
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative w-2/3">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Todos</option>
          <option value="user">Usuarios</option>
          <option value="psychologist">Psicólogos</option>
          <option value="admin">Administradores</option>
        </select>
      </div>

      <div className="flex justify-center mb-5">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-t-md ${activeTab === "users" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          <FaUsers /> Gestión de Usuarios
        </button>
        <button
          onClick={() => setActiveTab("psychologists")}
          className={`px-5 py-2 rounded-t-md ml-2 ${activeTab === "psychologists" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          <FaUserShield /> Gestión de Psicólogos
        </button>
        <button
          onClick={() => setActiveTab("assign")}
          className={`px-5 py-2 rounded-t-md ml-2 ${activeTab === "assign" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          <FaUserCheck /> Asignación de Psicólogos
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-5 py-2 rounded-t-md ml-2 ${activeTab === "requests" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          📩 Solicitudes Pendientes
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-5 py-2 rounded-t-md ml-2 ${activeTab === "reports" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          <FaChartBar /> Reporte Psicólogos
        </button>
        <button
          onClick={() => setActiveTab("reassign")}
          className={`px-5 py-2 rounded-t-md ml-2 ${activeTab === "reassign" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          <FaExchangeAlt /> Reasignación Masiva
        </button>
      </div>

      {activeTab === "users" && <UserManagement users={filteredUsers} fetchData={fetchData} />}
      {activeTab === "assign" && (
        <PsychologistAssignment
          users={filteredUsers.filter((u) => u.role === "user")}
          psychologists={psychologists}
          fetchData={fetchData}
        />
      )}
      {activeTab === "requests" && (
        <PendingRequests
          pendingRequests={pendingRequests}
          psychologists={psychologists}
          fetchData={fetchData}
        />
      )}
      {activeTab === "psychologists" && <PsychologistManagement />}
      {activeTab === "reports" && <PsychologistReports />}
      {activeTab === "reassign" && <PsychologistReassignment />}
    </div>
  );
};

export default AdminDashboard;