import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaClipboardList, FaFileAlt, FaTools, FaFolder, FaGraduationCap, FaIdCard, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BsFillCircleFill } from "react-icons/bs";

const PendingPsychologists = () => {
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPsychologist, setSelectedPsychologist] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPendingPsychologists();
  }, []);

  const fetchPendingPsychologists = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/pending-psychologists", { withCredentials: true });

      if (response.data.success) {
        const updatedPsychologists = response.data.pendingPsychologists.map(p => ({
          ...p,
          userId: {
            ...p.userId,
            profilePicture: p.userId.profilePicture?.startsWith("http") 
              ? p.userId.profilePicture 
              : `https://res.cloudinary.com/dkandom0b/image/upload/${p.userId.profilePicture}`,
            degreeCertificate: p.userId.degreeCertificate?.startsWith("http") 
              ? p.userId.degreeCertificate 
              : `https://res.cloudinary.com/dkandom0b/image/upload/${p.userId.degreeCertificate}`,
            professionalCard: p.userId.professionalCard?.startsWith("http") 
              ? p.userId.professionalCard 
              : `https://res.cloudinary.com/dkandom0b/image/upload/${p.userId.professionalCard}`,
          }
        }));

        setPendingPsychologists(updatedPsychologists);
      } else {
        toast.error("Error al obtener psicólogos pendientes.");
      }
    } catch (error) {
      toast.error("Error en la carga de datos.");
      setPendingPsychologists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setIsProcessing(true);
      const response = await axios.patch(`/api/admin/approve-psychologist/${userId}`, {}, { withCredentials: true });

      if (response.data.success) {
        toast.success("Psicólogo aprobado exitosamente.");
        fetchPendingPsychologists();
      } else {
        toast.error("Error al aprobar psicólogo.");
      }
    } catch (error) {
      toast.error("Error en la aprobación.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPsychologist || !rejectionReason) {
      toast.error("Selecciona un psicólogo y proporciona un motivo.");
      return;
    }

    try {
      setIsProcessing(true);
      const response = await axios.post(
        "/api/admin/reject-psychologist",
        { userId: selectedPsychologist, reason: rejectionReason },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Psicólogo rechazado exitosamente.");
        setRejectionReason("");
        setSelectedPsychologist("");
        fetchPendingPsychologists();
      } else {
        toast.error("Error al rechazar psicólogo.");
      }
    } catch (error) {
      toast.error("Error en el rechazo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">
        <FaClipboardList className="inline-block mr-2" /> Psicólogos Pendientes
      </h2>

      {loading && <p className="text-gray-500">Cargando...</p>}

      {Array.isArray(pendingPsychologists) && pendingPsychologists.length === 0 ? (
        <p className="text-gray-500">No hay psicólogos pendientes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPsychologists.map((p) => (
            <div key={p._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="flex justify-center mb-3">
                <img 
                  src={p.userId?.profilePicture} 
                  alt="Foto de perfil" 
                  className="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
              </div>

              <h3 className="text-lg font-bold text-center">
                {p.userId?.name} {p.userId?.last_name}
              </h3>
              <p className="text-sm text-gray-600 text-center">{p.userId?.email}</p>
              <p className="text-sm text-gray-600 text-center">{p.userId?.phone} | {p.userId?.city}</p>
              <p className="text-sm text-gray-600 text-center capitalize">Género: {p.userId?.gender}</p>
              <p className="text-sm text-gray-600 text-center">
                <FaFileAlt className="inline-block mr-2" /> Cédula: {p.userId?.documentId}
              </p>
              <p className="text-sm text-gray-600 text-center">
                <FaTools className="inline-block mr-2" /> Años de Experiencia: {p.userId?.experienceYears}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <p className="font-semibold text-center">
                  <FaFolder className="inline-block mr-2" /> Documentos
                </p>
                <div className="flex justify-center gap-2">
                  <a 
                    href={p.userId?.degreeCertificate} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    <FaGraduationCap className="inline-block mr-1" /> Acta de Grado
                  </a>
                  <a 
                    href={p.userId?.professionalCard} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                  >
                    <FaIdCard className="inline-block mr-1" /> Tarjeta Profesional
                  </a>
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleApprove(p.userId._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition w-1/2 flex items-center justify-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
                  ) : (
                    <FaCheckCircle className="mr-1" />
                  )}
                  Aprobar
                </button>
                <button
                  onClick={() => setSelectedPsychologist(p.userId._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition w-1/2"
                >
                  <FaTimesCircle className="inline-block mr-1" /> Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPsychologist && (
        <div className="mt-6 bg-gray-200 p-4 rounded-md">
          <h3 className="text-lg font-semibold">
            <BsFillCircleFill className="inline-block mr-2 text-red-500" /> Rechazar Psicólogo
          </h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Motivo del rechazo..."
            className="w-full border p-2 rounded-md"
          />
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition mt-2 flex items-center justify-center"
            disabled={isProcessing}
          >
            {isProcessing ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div> : "Rechazar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingPsychologists;