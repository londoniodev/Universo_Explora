import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/AuthStore.jsx";

const AccessManagement = () => {
  const { 
    purchasedAccesses,
    accessBalance,
    psychologistAccesses,
    handleGenerateAccessFromBalance,
    handleRevokeAccess,
    fetchPsychologistPurchases,
    fetchActiveAccesses,
    fetchPsychologistAccessBalance,
  } = useAuthStore();
  
  const [selectedPackage, setSelectedPackage] = useState("");

  useEffect(() => {
    fetchPsychologistPurchases();
    fetchActiveAccesses();
    fetchPsychologistAccessBalance();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Gestión de Accesos</h2>

      {/* Accesos Comprados */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Accesos Comprados</h3>
        {purchasedAccesses.length === 0 ? (
          <p className="text-gray-500 mt-2">No has comprado accesos aún.</p>
        ) : (
          <ul className="mt-2">
            {purchasedAccesses.map((purchase) => (
              <li key={purchase._id} className="bg-gray-100 p-2 rounded mb-2">
                <strong>Paquete: {purchase.packageName}</strong> - {purchase.quantity} accesos
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Generar Accesos */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Generar Accesos para Compartir</h3>
        <p className="text-gray-700 font-bold mt-2">Saldo disponible: {accessBalance}</p>

        <select
          className="mt-2 p-2 border border-gray-300 rounded"
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition mt-2"
          onClick={() => handleGenerateAccessFromBalance(selectedPackage)}
          disabled={accessBalance <= 0 || !selectedPackage}
        >
          Generar Acceso
        </button>
      </div>

      {/* Accesos Activos */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Accesos Activos</h3>
        {psychologistAccesses.length === 0 ? (
          <p className="text-gray-500 mt-2">No hay accesos activos.</p>
        ) : (
          <ul className="mt-2">
            {psychologistAccesses.map((access) => (
              <li key={access._id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                <span>
                  {access.token} -{" "}
                  <span className={access.used ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {access.used ? `Usado por ${access.usedByName || "Usuario no registrado"}` : "No usado"}
                  </span>
                </span>
                <button
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleRevokeAccess(access.token)}
                >
                  Revocar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccessManagement;