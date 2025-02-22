import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserMd, FaUserCheck, FaChartBar, FaSearch, FaFilter } from "react-icons/fa";

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
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700 flex items-center gap-2">
        <FaChartBar /> Reporte de Psicólogos
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-2/3">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-3 rounded-md w-full shadow-sm pl-10"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={filterPatients}
            onChange={(e) => setFilterPatients(e.target.value)}
            className="border p-3 rounded-md shadow-sm pl-10"
          >
            <option value="">Filtrar por cantidad de pacientes</option>
            <option value="5">Más de 5 pacientes</option>
            <option value="10">Más de 10 pacientes</option>
            <option value="20">Más de 20 pacientes</option>
          </select>
          <FaFilter className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-md shadow-md mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <FaChartBar /> Distribución de Pacientes
        </h3>
        <p className="mt-1">
          <b>🔝 Psicólogo con más pacientes:</b> {maxPatientsPsychologist.name} ({maxPatientsPsychologist.assignedPatients} pacientes)
        </p>
        <p className="mt-1">
          <b>🔻 Psicólogo con menos pacientes:</b> {minPatientsPsychologist.name} ({minPatientsPsychologist.assignedPatients} pacientes)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPsychologists.length > 0 ? (
          filteredPsychologists.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-300 p-5 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <FaUserMd /> {p.name} {p.last_name}
              </h3>
              <p className="text-gray-600">{p.email}</p>
              <p className="font-semibold text-gray-700 mt-2 flex items-center gap-2">
                <FaUserCheck /> Pacientes asignados: {p.assignedPatients}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full col-span-3">No se encontraron psicólogos con estos filtros.</p>
        )}
      </div>
    </div>
  );
};

export default PsychologistReports;