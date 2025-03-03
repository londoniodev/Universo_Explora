import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/AuthStore.jsx";
import { FaTrashAlt, FaCopy, FaTicketAlt } from "react-icons/fa";
import { IoKeyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { IoMdTime } from "react-icons/io";

const AccessManagement = () => {
  const { 
    purchasedAccesses,
    accessBalance,
    psychologistAccesses,
    handleGenerateAccessFromBalance,
    revokePsychologistAccess,
    fetchPsychologistPurchases,
    fetchActiveAccesses,
    fetchPsychologistAccessBalance,
  } = useAuthStore();
  
  const [selectedPackage, setSelectedPackage] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");

  useEffect(() => {
    fetchPsychologistPurchases();
    fetchActiveAccesses();
    fetchPsychologistAccessBalance();
  }, []);

  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado al portapapeles!");
  };

  return (
    <div className="p-6 bg-transparent min-h-screen flex flex-col items-center">
      <h2 className="text-3xl text-white font-bold mb-6">Gestión de Accesos</h2>

      {/* 📌 Accesos Comprados */}
      <div className="w-full max-w-3xl bg-transparent p-6">
        <h3 className="text-xl font-semibold text-white"><FaTicketAlt /> Accesos Comprados</h3>
        {purchasedAccesses.length === 0 ? (
          <p className="text-gray-300 mt-2">No has comprado accesos aún.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {purchasedAccesses.map((purchase) => (
              <li 
                key={purchase._id} 
                className="bg-blue-100 p-3 rounded-lg flex justify-between items-center"
              >
                <strong className="text-gray-700">{purchase.packageName}</strong>
                <span className="text-blue-600 font-bold">{purchase.quantity} accesos</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 🔑 Generar Accesos */}
      <div className="w-full max-w-3xl bg-transparent p-6 mt-6">
        <h3 className="text-xl font-semibold text-white"><IoKeyOutline /> Generar Accesos</h3>
        <p className="text-gray-300 mt-2 font-bold">Saldo disponible: <span className="text-green-400">{accessBalance}</span></p>

        <div className="flex mt-4 space-x-2">
          <select
            className="flex-1 p-2 border bg-[#101828] text-white border-gray-300 rounded-lg"
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
          >
            <option value="">Selecciona un paquete</option>
            {purchasedAccesses.map((purchase, index) => (
              <option key={`${purchase.packageId}-${index}`} value={purchase.packageId}>
                {purchase.packageName} - {purchase.quantity} accesos
              </option>
            ))}
          </select>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            onClick={async () => {
              const token = await handleGenerateAccessFromBalance(selectedPackage);
              if (token) setGeneratedToken(token);
            }}
            disabled={accessBalance <= 0 || !selectedPackage}
          >
            Generar
          </button>
        </div>

        {generatedToken && (
          <div className="bg-gray-100 p-3 rounded-lg mt-4 flex justify-between items-center">
            <span className="text-gray-700 truncate">{generatedToken}</span>
            <button 
              className="ml-2 bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition flex items-center"
              onClick={() => copyToClipboard(generatedToken)}
            >
              <FaCopy className="mr-1" /> Copiar
            </button>
          </div>
        )}
      </div>

      {/* ⏳ Accesos Activos */}
      <div className="w-full max-w-3xl bg-transparent p-6 mt-6">
        <h3 className="text-xl font-semibold text-white"><IoMdTime /> Accesos Activos</h3>
        {psychologistAccesses.length === 0 ? (
          <p className="text-gray-400 mt-2">No hay accesos activos.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {psychologistAccesses.map((access) => (
              <li 
                key={access._id} 
                className={`flex justify-between items-center p-3 rounded-lg 
                  ${access.revoked ? "bg-red-200 text-red-800" : access.used ? "bg-green-100" : "bg-gray-100"}
                `}
              >
                <span>
                  {access.token.substring(0, 15)}... -{" "}
                  <span className={access.used ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {access.revoked
                      ? "Revocado"
                      : access.used
                      ? `Usado por ${access.usedByName || "Usuario no registrado"}`
                      : "No usado"}
                  </span>
                </span>

                <div className="flex space-x-2">
                  {/* Botón copiar */}
                  <button 
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400 transition flex items-center"
                    onClick={() => copyToClipboard(access.token)}
                  >
                    <FaCopy className="mr-1" /> Copiar
                  </button>

                  {/* Botón revocar (solo si no está revocado) */}
                  {!access.revoked && (
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition flex items-center"
                      onClick={async () => {
                        const success = await revokePsychologistAccess(access.token);
                        if (success) {
                          toast.error("El token ha sido revocado.");
                        }
                      }}
                    >
                      <FaTrashAlt className="mr-1" /> Revocar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccessManagement;