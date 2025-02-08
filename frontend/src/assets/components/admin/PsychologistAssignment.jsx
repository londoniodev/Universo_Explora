import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const PsychologistAssignment = ({ users, psychologists, fetchData }) => {
  const [selectedPsychologist, setSelectedPsychologist] = useState("");

  const handleAssignPsychologist = async (userId) => {
    if (!selectedPsychologist) {
      toast.error("Selecciona un psicólogo.");
      return;
    }
  
    try {
      const response = await axios.post(
        "/api/admin/assign-psychologist",
        { userId, psychologistId: selectedPsychologist },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        toast.success("Usuario asignado a un psicólogo.");
        setSelectedPsychologist(""); // 🔥 Resetear selección después de asignar
        fetchData(); // 🔥 Refrescar la lista
      } else {
        toast.error(response.data.message);
      }
  
    } catch (error) {
      toast.error("Error al asignar psicólogo.");
    }
  };  

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Asignación de Psicólogos</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Asignar Psicólogo</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-100">
              <td className="p-2 border">{u.name} {u.last_name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border flex justify-center gap-3">
                <select
                  value={selectedPsychologist}
                  onChange={(e) => setSelectedPsychologist(e.target.value)}
                  className="border p-1 rounded-md"
                >
                  <option value="">Seleccionar Psicólogo...</option>
                  {psychologists.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAssignPsychologist(u._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                >
                  Asignar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PsychologistAssignment;