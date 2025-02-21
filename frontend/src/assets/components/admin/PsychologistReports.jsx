import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PsychologistReports = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPatients, setFilterPatients] = useState("");

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

  const filteredPsychologists = psychologists.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterPatients ? p.assignedPatients >= parseInt(filterPatients) : true;

    return matchesSearch && matchesFilter;
  });

  const maxPatientsPsychologist = psychologists.reduce(
    (max, p) => (p.assignedPatients > max.assignedPatients ? p : max),
    { assignedPatients: 0 }
  );

  const minPatientsPsychologist = psychologists.reduce(
    (min, p) => (p.assignedPatients < min.assignedPatients ? p : min),
    { assignedPatients: Infinity }
  );

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">📊 Reporte de Psicólogos</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-2/3"
        />
        <select
          value={filterPatients}
          onChange={(e) => setFilterPatients(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Filtrar por cantidad de pacientes</option>
          <option value="5">Más de 5 pacientes</option>
          <option value="10">Más de 10 pacientes</option>
          <option value="20">Más de 20 pacientes</option>
        </select>
      </div>

      <div className="bg-gray-100 p-3 rounded-md shadow mb-4">
        <h3 className="font-bold text-lg">📊 Distribución de Pacientes</h3>
        <p>
          <b>Psicólogo con más pacientes:</b> {maxPatientsPsychologist.name} ({maxPatientsPsychologist.assignedPatients} pacientes)
        </p>
        <p>
          <b>Psicólogo con menos pacientes:</b> {minPatientsPsychologist.name} ({minPatientsPsychologist.assignedPatients} pacientes)
        </p>
      </div>
    </div>
  );
};

export default PsychologistReports;