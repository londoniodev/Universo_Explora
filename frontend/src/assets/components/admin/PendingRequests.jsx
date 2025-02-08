import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const PendingRequests = ({ pendingRequests, psychologists, fetchData }) => {
  const [selectedPsychologist, setSelectedPsychologist] = useState("");

  const handleAssignPsychologist = async (userId) => {
    if (!selectedPsychologist) {
      toast.error("Selecciona un psicólogo.");
      return;
    }

    try {
      await axios.post(
        "/api/admin/assign-psychologist",
        { userId, psychologistId: selectedPsychologist },
        { withCredentials: true }
      );
      toast.success("Usuario asignado a un psicólogo.");
      fetchData();
    } catch (error) {
      toast.error("Error al asignar psicólogo.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Solicitudes Pendientes</h2>
      {pendingRequests.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 border">Usuario</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-100">
                <td className="p-2 border">{req.userId.name}</td>
                <td className="p-2 border">{req.userId.email}</td>
                <td className="p-2 border flex justify-center gap-3">
                  <select
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
                    onClick={() => handleAssignPsychologist(req.userId._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
                  >
                    Asignar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingRequests;