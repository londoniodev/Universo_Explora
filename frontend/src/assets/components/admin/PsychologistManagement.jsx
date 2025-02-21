import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PsychologistManagement = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await axios.get("/api/admin/psychologists/assigned-users", { withCredentials: true });

        if (response.data.success) {
          setPsychologists(response.data.psychologists);
        } else {
          console.error("⚠️ No se pudieron obtener los psicólogos correctamente.");
        }
      } catch (error) {
        toast.error("Error al obtener psicólogos.");
      }
    };

    fetchPsychologists();
  }, []);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleReassignUsers = async () => {
    if (!selectedPsychologist || selectedUsers.length === 0) {
      toast.error("Selecciona un psicólogo y al menos un usuario.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/admin/reassign-users",
        { userIds: selectedUsers, newPsychologistId: selectedPsychologist },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Usuarios reasignados exitosamente.");
        setSelectedUsers([]);
        setSelectedPsychologist("");
      } else {
        toast.error("Error al reasignar usuarios.");
      }
    } catch (error) {
      toast.error("Error en la reasignación.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">👨‍⚕️ Gestión de Psicólogos</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Seleccionar Psicólogo para Reasignación</label>
        <select
          value={selectedPsychologist}
          onChange={(e) => setSelectedPsychologist(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Seleccionar...</option>
          {psychologists.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} {p.last_name} ({p.assignedUsers.length} pacientes)
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border">Psicólogo</th>
            <th className="p-2 border">Usuarios Asignados</th>
          </tr>
        </thead>
        <tbody>
          {psychologists.map((p) => (
            <tr key={p._id} className="hover:bg-gray-100">
              <td className="p-2 border">{p.name} {p.last_name}</td>
              <td className="p-2 border">
                {p.assignedUsers.length > 0 ? (
                  <ul>
                    {p.assignedUsers.map((u) => (
                      <li key={u._id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={() => handleUserSelection(u._id)}
                          checked={selectedUsers.includes(u._id)}
                        />
                        {u.name} {u.last_name} ({u.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No tiene usuarios asignados</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button
          onClick={handleReassignUsers}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          disabled={selectedUsers.length === 0 || !selectedPsychologist}
        >
          Reasignar Pacientes Seleccionados
        </button>
      </div>
    </div>
  );
};

export default PsychologistManagement;