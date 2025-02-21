import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PsychologistReassignment = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [fromPsychologist, setFromPsychologist] = useState("");
  const [toPsychologist, setToPsychologist] = useState("");

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const response = await axios.get("/api/admin/psychologists-with-patients", { withCredentials: true });
        if (response.data.success) {
          setPsychologists(response.data.psychologists);
        }
      } catch (error) {
        toast.error("Error al obtener psicólogos.");
      }
    };

    fetchPsychologists();
  }, []);

  const handleReassignAll = async () => {
    if (!fromPsychologist || !toPsychologist || fromPsychologist === toPsychologist) {
      toast.error("Selecciona correctamente los psicólogos.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/admin/reassign-all-patients",
        { fromPsychologist, toPsychologist },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Pacientes reasignados exitosamente.");
        setFromPsychologist("");
        setToPsychologist("");
      } else {
        toast.error("Error al reasignar pacientes.");
      }
    } catch (error) {
      toast.error("Error en la reasignación.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">🚀 Reasignación Masiva de Psicólogos</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Seleccionar Psicólogo a quien QUITAR pacientes</label>
        <select
          value={fromPsychologist}
          onChange={(e) => setFromPsychologist(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Seleccionar...</option>
          {psychologists
            .filter((p) => p.assignedPatients > 0)
            .map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} {p.last_name} ({p.assignedPatients} pacientes)
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Seleccionar Psicólogo que RECIBIRÁ pacientes</label>
        <select
          value={toPsychologist}
          onChange={(e) => setToPsychologist(e.target.value)}
          className="border p-2 rounded-md w-full"
        >
          <option value="">Seleccionar...</option>
          {psychologists.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} {p.last_name} ({p.assignedPatients} pacientes)
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={handleReassignAll}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          disabled={!fromPsychologist || !toPsychologist || fromPsychologist === toPsychologist}
        >
          Reasignar TODOS los Pacientes
        </button>
      </div>
    </div>
  );
};

export default PsychologistReassignment;