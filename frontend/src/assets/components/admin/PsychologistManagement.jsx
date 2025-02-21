import { useState, useEffect } from "react";
import axios from "axios";

const PsychologistManagement = () => {
  const [psychologists, setPsychologists] = useState([]);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await axios.get("/api/admin/psychologists/assigned-users", { withCredentials: true });
        if (response.data.success) {
          setPsychologists(response.data.psychologists);
        } else {
          console.error("⚠️ No se pudo obtener la lista de psicólogos.");
        }
      } catch (error) {
        console.error("❌ Error al obtener la lista de psicólogos:", error);
      }
    };

    fetchPsychologists();
  }, []);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Gestión de Psicólogos</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-2 border">Psicólogo</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Usuarios Asignados</th>
          </tr>
        </thead>
        <tbody>
          {psychologists.map((p) => (
            <tr key={p._id} className="hover:bg-gray-100">
              <td className="p-2 border">{p.name} {p.last_name}</td>
              <td className="p-2 border">{p.email}</td>
              <td className="p-2 border">
                {p.assignedUsers.length > 0 ? (
                  <ul>
                    {p.assignedUsers.map((u) => (
                      <li key={u._id}>{u.name} {u.last_name} ({u.email})</li>
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
    </div>
  );
};

export default PsychologistManagement;