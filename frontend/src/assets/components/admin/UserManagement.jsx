import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaUserEdit, FaSpinner } from "react-icons/fa";
import { socket } from "../../../store/AuthStore.jsx";

const UserManagement = ({ fetchData }) => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();

    socket.on("userUpdated", () => {
      fetchUsers();
    });

    return () => {
      socket.off("userUpdated");
    };
  }, []);


  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/users", { withCredentials: true });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error("Error al obtener usuarios.");
      }
    } catch (error) {
      toast.error("Error en la carga de datos.");
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoadingUserId(userId);

    try {
      await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true });
      toast.success("Usuario eliminado correctamente.");
      fetchUsers();
      socket.emit("userUpdated");
    } catch (error) {
      toast.error("Error al eliminar usuario.");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleEditRole = async (userId, selectedRole) => {
    if (!selectedRole) {
      toast.error("Selecciona un rol válido.");
      return;
    }

    try {
      await axios.put(`/api/admin/users/${userId}/role`, { newRole: selectedRole }, { withCredentials: true });
      toast.success("Rol actualizado correctamente.");
      fetchUsers();
      setEditingUserId(null);
      setNewRole("");
      socket.emit("userUpdated");
    } catch (error) {
      toast.error("Error al actualizar el rol.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Rol</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-100">
              <td className="p-2 border">{u.name} {u.last_name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                {editingUserId === u._id ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border p-1 rounded-md"
                  >
                    <option value="">Seleccionar rol...</option>
                    <option value="user">Usuario</option>
                    <option value="psychologist">Psicólogo</option>
                    <option value="admin">Administrador</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td className="p-2 border flex justify-center gap-3">
                {editingUserId === u._id ? (
                  <>
                    <button
                      onClick={() => handleEditRole(u._id, newRole)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                    >
                      <FaUserEdit /> Guardar
                    </button>
                    <button
                      onClick={() => {
                        setEditingUserId(null);
                        setNewRole("");
                      }}
                      className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingUserId(u._id);
                      setNewRole(u.role);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    <FaUserEdit /> Editar Rol
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition flex items-center gap-2"
                  disabled={loadingUserId === u._id}
                >
                  {loadingUserId === u._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;